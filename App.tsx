import React, { useState, useEffect, useMemo, useRef } from 'react';
import { generateText, generateSpeech } from './src/services/aiService';
import { decodeBase64, decodeAudioData } from './src/lib/audioUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { StudyPlan } from './components/StudyPlan';
import { AudioPlayer } from './components/AudioPlayer';
import { 
  Waves, CheckCircle, 
  Menu, X, Trophy, Brain, Radio, Activity, Monitor,
  Sparkles, GraduationCap, ClipboardCheck, 
  Medal, Zap, TrendingUp, Award, PlayCircle, Loader2, Music, Download,
  AlertTriangle, ShieldCheck, Home, Calendar, Bot, Stethoscope,
  FileText, Target, Timer, Volume2, Quote, Play, Headphones, HeartPulse, FlaskConical, Target as TargetIcon,
  Sun, Moon, Cloud, Bell, Layers, Info, Terminal, Cpu, Database, Book, Pause, VolumeX, ChevronRight, ChevronLeft, Gauge, Save, ScrollText, User,
  LayoutGrid, Settings as SettingsIcon, Lock, Shield, Power, Crown, Maximize, Minimize
} from 'lucide-react';
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
} from './components/VisualElements';
import { AITutor } from './components/AITutor';
import { CompanionAvatar } from './components/CompanionAvatar';
import { Reminders } from './components/Reminders';
import { ExamEngine } from './components/ExamEngine';
import { Flashcards } from './components/Flashcards';
import { Glossary } from './components/Glossary';
import { AdvancedQuiz } from './components/AdvancedQuiz';
import { UserProfile } from './components/UserProfile';
import { LegalDocs } from './components/LegalDocs';
import { Pricing } from './components/Pricing';
import { GlobalRadio } from './components/GlobalRadio';
import { useRadio } from './src/context/RadioContext';
import { StudyStreak } from './components/StudyStreak';
import { DailyChallenge } from './components/DailyChallenge';
import { StudyAnalytics } from './components/StudyAnalytics';
import { Settings } from './components/Settings';
import { Achievements } from './components/Achievements';
import { NeuralLoad } from './components/NeuralLoad';
import { FullscreenToggle } from './components/FullscreenToggle';
import { AssetLibrary } from './components/AssetLibrary';
import { InteractiveWave } from './components/InteractiveWave';
import { CLINICAL_TIPS } from './src/constants/clinicalTips';
import { AudioCache } from './src/lib/audioCache';
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
            animate={{ opacity: isDarkMode ? 0.15 : 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${bgImage})`,
              y: scrollY * 0.05
            }}
          />
        ) : null}
      </AnimatePresence>
      
      <motion.div 
        style={{ y: scrollY * 0.1 }}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.03] dark:opacity-[0.05]"
      >
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-registry-teal rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-[70%] w-96 h-96 bg-registry-rose rounded-full blur-[150px]" />
        <div className="absolute top-[30%] left-[40%] w-80 h-80 bg-registry-cobalt rounded-full blur-[130px]" />
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
      className="p-4 bg-slate-50 dark:bg-registry-teal/5 border border-slate-200 dark:border-registry-teal/20 rounded-2xl flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-registry-teal/10 transition-all shadow-sm dark:shadow-none"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-registry-teal/10 dark:bg-registry-teal/20 rounded-xl">
          <Music className="w-5 h-5 text-registry-teal" />
        </div>
        <div>
          <h5 className="text-[10px] font-black uppercase text-registry-teal tracking-widest">Lesson Anthem</h5>
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

const modules: Module[] = [
  { title: "Waves and Sound", weight: "15%", icon: Waves, color: "from-registry-teal/80 to-registry-teal", lessons: [{ title: "The Nature of Sound", id: "1.1" }, { title: "Essential Wave Parameters", id: "1.2" }, { title: "Interaction with Media", id: "1.3" }] },
  { title: "Transducers", weight: "20%", icon: Radio, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Piezoelectric Anatomy", id: "2.1" }, { title: "Array Types", id: "2.2" }, { title: "Beam Focusing", id: "2.3" }] },
  { title: "Pulsed Wave", weight: "10%", icon: Zap, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Pulse-Echo Principle", id: "3.1" }] },
  { title: "Doppler Effect", weight: "15%", icon: Activity, color: "from-registry-teal to-registry-cobalt", lessons: [{ title: "The Doppler Principle", id: "4.1" }, { title: "Doppler Modalities", id: "4.2" }] },
  { title: "Imaging Artifacts", weight: "10%", icon: AlertTriangle, color: "from-registry-amber to-registry-rose", lessons: [{ title: "Propagation Artifacts", id: "5.1" }, { title: "Attenuation Artifacts", id: "5.2" }] },
  { title: "Bioeffects & Safety", weight: "5%", icon: ShieldCheck, color: "from-stealth-800 to-stealth-950", lessons: [{ title: "ALARA & Mechanisms", id: "6.1" }, { title: "Safety Indices", id: "6.2" }] },
  { title: "Hemodynamics", weight: "10%", icon: HeartPulse, color: "from-registry-rose to-registry-cobalt", lessons: [{ title: "Flow Patterns", id: "7.1" }, { title: "Physical Principles", id: "7.2" }] },
  { title: "Quality Assurance", weight: "5%", icon: FlaskConical, color: "from-registry-teal to-stealth-800", lessons: [{ title: "QA Principles", id: "8.1" }] },
  { title: "Spatial Resolution", weight: "5%", icon: TargetIcon, color: "from-registry-cobalt to-registry-cobalt", lessons: [{ title: "Axial Resolution", id: "9.1" }, { title: "Lateral Resolution", id: "9.2" }] },
  { title: "Harmonics", weight: "5%", icon: Sparkles, color: "from-registry-teal to-registry-teal", lessons: [{ title: "Non-Linear Propagation", id: "10.1" }, { title: "Tissue Harmonic Imaging", id: "10.2" }] },
  { title: "Instrumentation", weight: "10%", icon: Monitor, color: "from-stealth-800 to-registry-teal", lessons: [{ title: "Receiver Functions", id: "11.1" }, { title: "Display Modes", id: "11.2" }] },
  { title: "Advanced Modalities", weight: "5%", icon: Cpu, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Elastography & Contrast", id: "12.1" }, { title: "Pulse Inversion", id: "12.2" }] },
  { title: "Doppler Principles", weight: "15%", icon: Activity, color: "from-registry-teal to-registry-cobalt", lessons: [{ title: "Doppler Principles", id: "13.1" }, { title: "Color & Spectral Doppler", id: "13.2" }] },
  { title: "Artifacts", weight: "10%", icon: AlertTriangle, color: "from-registry-amber to-registry-rose", lessons: [{ title: "Imaging Artifacts", id: "14.1" }, { title: "Doppler Artifacts", id: "14.2" }] },
  { title: "Bioeffects & Safety", weight: "5%", icon: ShieldCheck, color: "from-stealth-800 to-stealth-950", lessons: [{ title: "Bioeffects & Safety", id: "15.1" }] }
];

const lessonContent: LessonContentMap = {
  "1.1": {
    title: "The Nature of Sound",
    narrationScript: "Imagine sound as a relay race where energy is passed from one runner to the next. In ultrasound, these runners are molecules. Sound is a mechanical, longitudinal wave—mechanical because it needs a medium to travel, and longitudinal because the runners move back and forth in the same direction as the race.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LongitudinalWaveVisual />
        <LessonAnthem stationName="Sound Waves" />
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">Sound is not just a noise; it's a <strong>mechanical disturbance</strong> that travels through a medium. Without molecules to bump into each other, sound simply cannot exist.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LectureTag type="Concept" label="Mechanical Wave" content="A wave that requires a physical medium (like tissue, air, or water) to propagate. It cannot travel in a vacuum." />
          <LectureTag type="Def" label="Longitudinal Wave" content="A wave where particle vibration is parallel to the direction of wave travel." />
          <LectureTag type="Not" label="Vacuum Travel" content="Many students think sound can travel in space like light. It cannot. No medium = No sound." />
          <LectureTag type="Tip" label="Clinical Contact" content="In a clinical setting, if you lose your image, check your gel. Air between the probe and skin is the most common cause of poor image quality." />
        </div>
        <div className="bg-slate-100 dark:bg-stealth-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-stealth-800">
          <h4 className="text-xl font-black uppercase italic mb-6">Velocity in Media</h4>
          <SpeedOfSoundTable />
          <LectureTag type="Tip" label="Stiffness & Speed" content="Stiffness and Speed go in the Same direction (both start with S). Density and Speed go in Opposite directions." />
        </div>
        <div className="flex justify-center pt-8">
          <button 
            onClick={() => { window.dispatchEvent(new CustomEvent('open-flashcards', { detail: 'Waves and Sound' })); }}
            className="flex items-center space-x-3 px-8 py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all"
          >
            <Layers className="w-5 h-5" />
            <span>Review Wave Flashcards</span>
          </button>
        </div>
      </div>
    ),
    quiz: { id: "q1.1", type: "mcq", question: "Which describes particles in a longitudinal wave?", options: ["Particles move perpendicular", "Particles move parallel", "Particles remain static", "Particles rotate"], correctAnswer: 1, explanation: "Parallel oscillation creates compressions and rarefactions.", visualContext: <LongitudinalWaveVisual /> }
  },
  "1.2": {
    title: "Essential Wave Parameters",
    narrationScript: "Every ultrasound wave is defined by seven parameters. Think of these as the DNA of the wave. Frequency is the heartbeat—how many times it pulses per second. Wavelength is the stride length. Note the inverse relationship: as frequency goes up, wavelength must go down.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Frequency & Period" />
        <LessonAnthem stationName="Wavelength" />
        <LessonAnthem stationName="Propagation Speed" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WaveParametersVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Frequency" content="Number of cycles per second. Measured in Hertz (Hz). In ultrasound, we use Megahertz (MHz)." />
            <LectureTag type="Def" label="Wavelength" content="The distance or length of one complete cycle." />
            <LectureTag type="Tip" label="Inverse Relationship" content="Higher Frequency = Shorter Wavelength = Better Resolution but Less Penetration." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LessonAnthem stationName="Intensity" />
            <LessonAnthem stationName="Power & Area" />
            <LectureTag type="Concept" label="Amplitude & Power" content="The 'bigness' of the wave. Power is proportional to Amplitude squared." />
            <LectureTag type="Not" label="Intensity" content="Intensity is not just power; it's power divided by area. Focus the beam, and intensity skyrockets!" />
          </div>
          <IntensityProfileVisual />
        </div>
      </div>
    )
  },
  "1.3": {
    title: "Interaction with Media",
    narrationScript: "When sound hits an interface, it's like a ball hitting a wall. Some of it bounces back (reflection), some goes through but bends (refraction), and some scatters in all directions. Reflection is what we use to create the image.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Attenuation" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WaveInteractionVisual />
          <SpecularScatteringVisual />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Acoustic Impedance" content="The resistance to sound travel. Reflection only occurs if there is an impedance mismatch at the boundary." />
            <LectureTag type="Not" label="Refraction" content="Refraction requires two things: Oblique incidence AND different propagation speeds. Without both, no bending occurs." />
          </div>
          <AcousticImpedanceVisual />
        </div>
        
        <div className="mt-12 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal">Deep Dive: Attenuation Physics</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <AttenuationSimulator />
        </div>
      </div>
    )
  },
  "2.1": {
    title: "Piezoelectric Anatomy",
    narrationScript: "The transducer is the heart of the system. It uses the piezoelectric effect to turn electricity into sound and back again. But it's not perfect—it creates side lobes, which are like 'leaky' energy that can cause artifacts.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="The Transducer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransducerCrossSection />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Piezoelectric Effect" content="The property of certain materials to create a voltage when pressure is applied, and vice versa." />
            <LectureTag type="Def" label="Curie Point" content="The temperature at which PZT is polarized. If you heat a probe above this, it loses its piezoelectric properties forever." />
            <LectureTag type="Tip" label="Matching Layer" content="The matching layer is 1/4 wavelength thick. It bridges the impedance gap between the crystal and the skin." />
            <LectureTag type="Tip" label="Probe Care" content="Never drop your probe! The PZT crystals are extremely fragile and can crack, leading to 'dead' scan lines in your image." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Side Lobes" content="Secondary energy beams created by single-element transducers. They create artifacts by reflecting off structures outside the main beam." />
            <LectureTag type="Not" label="Grating Lobes" content="Grating lobes are similar to side lobes but are created by array transducers. We reduce them using apodization." />
          </div>
          <SideLobeVisual />
        </div>
      </div>
    )
  },
  "2.2": {
    title: "Array Types",
    narrationScript: "Modern ultrasound uses arrays—many small crystals working together. By timing when each crystal fires, we can steer and focus the beam without moving the probe. This is the magic of phasing.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <ArrayTypesVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Linear Phased Array" content="Small footprint, fan-shaped image. Used for cardiac imaging between ribs." />
            <LectureTag type="Def" label="Huygens' Principle" content="The idea that a large wave front is actually made of many tiny 'wavelets' that interfere with each other." />
            <LectureTag type="Tip" label="Steering vs Focusing" content="Electronic steering uses a slope (diagonal firing). Electronic focusing uses a curve (cup-shaped firing)." />
          </div>
          <HuygensPrincipleVisual />
        </div>
      </div>
    )
  },
  "2.3": {
    title: "Beam Focusing",
    narrationScript: "A beam of sound isn't a straight line; it's shaped like an hourglass. The narrowest part is the focus, where resolution is best. We can focus the beam using lenses, curved crystals, or electronic phasing.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BeamFocusVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Near Zone (Fresnel)" content="The region from the transducer to the focus. The beam narrows here." />
            <LectureTag type="Def" label="Far Zone (Fraunhofer)" content="The region starting at the focus and extending deeper. The beam diverges here." />
            <LectureTag type="Not" label="Focal Zone" content="The focal zone is the area around the focus where the beam is relatively narrow. It's the region of best lateral resolution." />
          </div>
        </div>
        
        <div className="mt-12 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-rose">Phase 3: Beam Forming Simulation</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <BeamLab />
        </div>

        <div className="clinical-card p-8">
          <h4 className="text-xl font-black uppercase italic mb-6">Diffraction Patterns</h4>
          <FresnelFraunhoferVisual />
          <LectureTag type="Tip" label="NZL Formula" content="Near Zone Length = (Diameter² × Frequency) / 6. Larger diameter or higher frequency = Deeper focus." />
        </div>
      </div>
    )
  },
  "3.1": {
    title: "Pulse-Echo Principle",
    narrationScript: "Ultrasound is mostly listening. We send a short pulse and then wait for the echo. The system knows how deep a structure is by measuring how long it took for the sound to return. Remember the 13 microsecond rule!",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PulseEchoPrincipleVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Range Equation" content="Distance = (Propagation Speed × Round Trip Time) / 2." />
            <LectureTag type="Def" label="13 µs Rule" content="In soft tissue, it takes 13 microseconds for sound to travel 1 cm deep and return (2 cm total travel)." />
            <LectureTag type="Tip" label="Depth Calculation" content="If the time-of-flight is 39 µs, the object is 3 cm deep. (39 / 13 = 3)." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Duty Factor" content="The percentage of time the system is actually transmitting. In 2D imaging, it's usually less than 1%!" />
            <LectureTag type="Not" label="Pulse Duration" content="Pulse duration is the time the pulse is 'on'. It is determined by the source and cannot be changed by the sonographer." />
          </div>
          <DutyFactorVisual />
        </div>
      </div>
    )
  },
  "4.1": {
    title: "The Doppler Principle",
    narrationScript: "Doppler is all about motion. When sound hits a moving target like blood, the frequency changes. This change is the Doppler shift. If blood moves toward the probe, the frequency increases—that's a positive shift.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DopplerShiftVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Shift" content="The difference between the transmitted and received frequencies. Shift = Received - Transmitted." />
            <LectureTag type="Def" label="Demodulation" content="The process of extracting the low-frequency Doppler shift from the high-frequency carrier wave." />
            <LectureTag type="Tip" label="Direction of Flow" content="Toward the probe = Positive shift (Higher frequency). Away from the probe = Negative shift (Lower frequency)." />
            <LectureTag type="Tip" label="Angle is Everything" content="Always aim for a 60-degree angle or less for accurate velocity measurements. 0 degrees is ideal, but 90 degrees is a Doppler disaster!" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Equation" content="Shift = (2 × Velocity × Frequency × Cosine θ) / Propagation Speed." />
            <LectureTag type="Not" label="Cosine of 90°" content="At 90 degrees, the cosine is zero. This means you will see NO Doppler shift even if blood is moving fast!" />
          </div>
          <DopplerAngleExplainer />
        </div>
      </div>
    )
  },
  "4.2": {
    title: "Doppler Modalities",
    narrationScript: "We have different ways to show Doppler. Color Doppler gives us a map of flow, while Spectral Doppler gives us exact velocities. But watch out for aliasing—it's like a fast-moving wheel appearing to spin backwards when it exceeds the system's speed limit.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Nyquist Limit" />
        <DopplerModalitiesVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Aliasing" content="The most common artifact in Pulsed Doppler. It occurs when the Doppler shift exceeds the Nyquist limit (PRF / 2)." />
            <LectureTag type="Def" label="Variance Mode" content="A color map that shows not just direction, but also turbulence. Green or yellow usually indicates chaotic flow." />
            <LectureTag type="Tip" label="Fixing Aliasing" content="To fix aliasing: 1. Increase PRF (Scale), 2. Use a lower frequency probe, 3. Find a shallower window." />
          </div>
          <ColorVarianceVisual />
        </div>
        <div className="mt-12">
          <NyquistLimitVisual />
        </div>
      </div>
    )
  },
  "5.1": {
    title: "Propagation Artifacts",
    narrationScript: "Artifacts are 'acoustic lies.' The system assumes sound travels at exactly 1540 m/s in a straight line. When these assumptions are broken, we get artifacts like reverberation or mirror images.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Propagation Artifacts" />
        <ArtifactsVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Reverberation" content="Multiple, equally spaced reflections caused by sound bouncing between two strong reflectors." />
          <LectureTag type="Def" label="Comet Tail" content="A form of reverberation where the reflections are so close together they appear as a solid line." />
          <LectureTag type="Not" label="Mirror Image" content="A mirror image artifact always appears deeper than the real structure. It's caused by sound reflecting off a strong, curved boundary like the diaphragm." />
        </div>
      </div>
    )
  },
  "5.2": {
    title: "Attenuation Artifacts",
    narrationScript: "Shadowing and enhancement tell us about the tissue's density. A stone blocks sound, creating a shadow. A fluid-filled cyst lets sound pass easily, making everything behind it look brighter—that's enhancement.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <AttenuationComparison />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Acoustic Shadowing" content="A dark region deeper than a highly attenuating structure (like a gallstone)." />
          <LectureTag type="Def" label="Enhancement" content="A bright region deeper than a low-attenuating structure (like a full bladder)." />
          <LectureTag type="Tip" label="Edge Shadowing" content="Caused by refraction at the edges of a curved structure. It's not about attenuation; it's about the beam bending away." />
          <LectureTag type="Tip" label="Artifact or Pathology?" content="If you see a shadow, try scanning from a different angle. If the shadow persists, it's likely a real structure (like a stone)." />
        </div>
      </div>
    )
  },
  "6.1": {
    title: "ALARA & Mechanisms",
    narrationScript: "Safety first. We use the ALARA principle: As Low As Reasonably Achievable. Ultrasound can heat tissue or create tiny bubbles—a process called cavitation. We must always monitor our output to keep the patient safe.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Bioeffects & Safety" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BioeffectMechanismsVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="ALARA" content="The principle of using the minimum acoustic power and exposure time to get a diagnostic image." />
            <LectureTag type="Def" label="Cavitation" content="The interaction of ultrasound with microscopic gas bubbles in the tissue." />
            <LectureTag type="Tip" label="Thermal Mechanism" content="Bioeffects caused by the rise in tissue temperature. Bone absorbs more energy and heats up faster than soft tissue." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Stable Cavitation" content="Bubbles oscillate but do not burst. Associated with lower intensity levels." />
            <LectureTag type="Not" label="Transient Cavitation" content="Also called 'inertial' cavitation. Bubbles burst, creating localized high temperatures and pressures. Very dangerous!" />
          </div>
          <CavitationVisual />
        </div>
      </div>
    )
  },
  "6.2": {
    title: "Safety Indices",
    narrationScript: "The system gives us two numbers to watch: TI and MI. TI is the Thermal Index—it estimates how much the temperature might rise. MI is the Mechanical Index—it tells us the risk of cavitation. Keep them low, especially in sensitive areas like the eyes or a fetus.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SafetyIndicesVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Thermal Index (TI)" content="A ratio of the acoustic power produced to the power needed to raise tissue temperature by 1°C." />
            <LectureTag type="Def" label="Mechanical Index (MI)" content="A value related to the likelihood of cavitation. MI = Peak Rarefactional Pressure / √Frequency." />
            <LectureTag type="Tip" label="Safe Limits" content="Generally, keep MI < 1.9 and TI < 1.0 for most diagnostic exams." />
          </div>
        </div>
      </div>
    )
  },
  "7.1": {
    title: "Flow Patterns",
    narrationScript: "Blood flow isn't always the same. In a healthy vessel, it's laminar—smooth and orderly. But when there's a blockage or a sharp turn, it becomes turbulent. Think of a calm river versus white-water rapids.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FlowPatternsVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Laminar Flow" content="Orderly flow where layers of blood slide over each other. Velocity is highest in the center." />
            <LectureTag type="Def" label="Turbulent Flow" content="Chaotic flow with eddies and swirls. Often found downstream from a stenosis." />
            <LectureTag type="Tip" label="Reynolds Number" content="A unitless number that predicts turbulence. If it's over 2000, the flow is likely turbulent." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Stenosis" content="A narrowing in a vessel. Velocity increases at the stenosis, and pressure drops—this is the Bernoulli Principle." />
            <LectureTag type="Not" label="Plug Flow" content="In plug flow, all layers move at the same velocity. This usually occurs at the entrance of large vessels like the aorta." />
          </div>
          <StenosisHemodynamicsExplainer />
        </div>
      </div>
    )
  },
  "7.2": {
    title: "Physical Principles",
    narrationScript: "Hemodynamics is the study of blood flow. It's governed by pressure, resistance, and flow. The Bernoulli Principle tells us that as velocity goes up, pressure goes down. Poiseuille's Law tells us how resistance changes with vessel diameter.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <HemodynamicsPrinciplesVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Bernoulli Principle" content="Describes the relationship between velocity and pressure. High velocity = Low pressure." />
          <LectureTag type="Def" label="Poiseuille's Law" content="Describes the relationship between pressure, flow, and resistance. Resistance is highly sensitive to vessel radius (Radius to the 4th power!)." />
          <LectureTag type="Tip" label="Hydrostatic Pressure" content="The weight of blood pressing against the vessel walls. It changes with the patient's position relative to the heart." />
        </div>
      </div>
    )
  },
  "8.1": {
    title: "QA Principles",
    narrationScript: "We must test our equipment regularly to ensure it's accurate. We use phantoms that mimic human tissue. One key test is the 'Dead Zone'—the area right next to the probe where we can't see anything. If the dead zone gets bigger, it might mean the transducer is failing.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Quality Assurance" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QAPhantomVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Quality Assurance" content="The routine, periodic evaluation of an ultrasound system to guarantee optimal image quality." />
            <LectureTag type="Def" label="Tissue Equivalent Phantom" content="A phantom that has acoustic properties (speed, attenuation, scattering) similar to soft tissue." />
            <LectureTag type="Tip" label="Sensitivity" content="The ability of the system to display low-level echoes. We test this by looking at the deepest echoes in the phantom." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Dead Zone" content="The region close to the transducer where images are inaccurate. Caused by the time it takes for the crystal to stop ringing." />
            <LectureTag type="Not" label="Standoff Pad" content="If you need to see a very shallow structure (like a superficial mass), use a standoff pad to move the structure out of the dead zone." />
          </div>
          <DeadZoneVisual />
        </div>
      </div>
    )
  },
  "9.1": {
    title: "Axial Resolution",
    narrationScript: "Resolution is the ability to see two structures as separate. Axial resolution is about seeing things that are one in front of the other. To improve it, we need shorter pulses, which means higher frequency and more damping.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResolutionComparison />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Axial Resolution" content="The ability to distinguish two structures that are parallel to the sound beam." />
            <LectureTag type="Def" label="Spatial Pulse Length (SPL)" content="The distance from the start to the end of a pulse. Axial Resolution = SPL / 2." />
            <LectureTag type="Tip" label="LARRD" content="Mnemonic for Axial Resolution: Longitudinal, Axial, Range, Radial, Depth." />
          </div>
        </div>
        <div className="clinical-card p-8">
          <h4 className="text-xl font-black uppercase italic mb-6">Damping & Resolution</h4>
          <DampingResolutionExplainer />
          <LectureTag type="Not" label="Frequency & Axial" content="Higher frequency improves axial resolution because it creates shorter pulses. It does NOT improve lateral resolution in the far field." />
        </div>
      </div>
    )
  },
  "9.2": {
    title: "Lateral Resolution",
    narrationScript: "Lateral resolution is about seeing things side-by-side. It depends entirely on the width of the beam. A narrower beam means better lateral resolution. This is why we focus the beam!",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResolutionComparison />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Lateral Resolution" content="The ability to distinguish two structures that are perpendicular to the sound beam." />
            <LectureTag type="Def" label="Beam Width" content="Lateral resolution is equal to the beam diameter. Narrower is better." />
            <LectureTag type="Tip" label="LATA" content="Mnemonic for Lateral Resolution: Lateral, Angular, Transverse, Azimuthal." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Temporal Resolution" content="The ability to see moving structures in real-time. Determined by frame rate." />
            <LectureTag type="Not" label="Lateral vs Depth" content="Lateral resolution changes with depth because the beam width changes. It is best at the focus." />
          </div>
          <TemporalResolutionVisual />
        </div>
      </div>
    )
  },
  "10.1": {
    title: "Non-Linear Propagation",
    narrationScript: "Sound doesn't always travel at a constant speed. In high-pressure areas (compressions), it travels slightly faster than in low-pressure areas (rarefactions). This 'non-linear' behavior creates harmonics—new frequencies that are multiples of the original one.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Physics Anthems" />
        <HarmonicImagingVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Non-Linear Propagation" content="The phenomenon where sound travels at different speeds during different parts of the cycle." />
          <LectureTag type="Def" label="Harmonic Frequency" content="Twice the fundamental frequency. If you transmit at 2 MHz, the harmonic is 4 MHz." />
          <LectureTag type="Tip" label="Creation Depth" content="Harmonics are not created at the surface; they develop deeper in the tissue. This helps eliminate superficial artifacts like clutter." />
        </div>
      </div>
    )
  },
  "10.2": {
    title: "Tissue Harmonic Imaging",
    narrationScript: "Harmonic imaging is like a filter for your image. By listening only to the harmonic frequencies, we can get rid of noise and clutter, resulting in a much cleaner, sharper image. It's especially useful for difficult-to-image patients.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Registry Anthem" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PulseInversionVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Pulse Inversion Harmonics" content="A technique where two pulses are sent down each scan line—one normal and one inverted. They cancel out the fundamental frequency, leaving only the harmonic." />
            <LectureTag type="Def" label="Signal-to-Noise Ratio" content="Harmonic imaging significantly increases this ratio, making the real anatomy stand out from the background noise." />
            <LectureTag type="Not" label="Harmonics & Penetration" content="Since harmonics are higher frequency, they attenuate faster. However, because they are created deeper in the tissue, they still provide excellent diagnostic information." />
          </div>
        </div>
      </div>
    )
  },
  "11.1": {
    title: "Receiver Functions",
    narrationScript: "The receiver is the brain of the ultrasound system. It takes the tiny electrical signals from the transducer and processes them through five steps: Amplification, Compensation, Compression, Demodulation, and Reject. Remember them in order!",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Amplitude & Layers" />
        <ReceiverPipelineVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Amplification (Gain)" content="Increases the strength of all signals equally. Does not improve signal-to-noise ratio." />
            <LectureTag type="Def" label="Compensation (TGC)" content="Corrects for attenuation by amplifying echoes from deeper structures more than shallow ones." />
            <LectureTag type="Tip" label="Order of Operations" content="Mnemonic: Alphabetical order! Amplification, Compensation, Compression, Demodulation, Reject." />
          </div>
          <PrePostProcessingVisual />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Compression" content="Reduces the range of signals to fit within the system's dynamic range. Keeps the image from being too 'contrasty'." />
            <LectureTag type="Not" label="Demodulation" content="The only receiver function that cannot be adjusted by the sonographer. It converts the radio frequency signal into a video signal." />
          </div>
          <div className="space-y-4">
            <TGCVisual />
            <ScanConverterVisual />
            <DynamicRangeVisual />
            <DemodulationVisual />
          </div>
        </div>
      </div>
    )
  },
  "11.2": {
    title: "Display Modes",
    narrationScript: "We have three main ways to show the data. A-mode is for distance, B-mode is for 2D anatomy, and M-mode is for motion over time. Each has its own specific use in the diagnostic world.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <DisplayModesVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="B-Mode (Brightness Mode)" content="The basis for all real-time 2D imaging. The brightness of the dot represents the strength of the echo." />
          <LectureTag type="Def" label="M-Mode (Motion Mode)" content="Shows the position of reflectors over time. Used extensively in cardiac imaging to measure valve motion." />
          <LectureTag type="Tip" label="A-Mode (Amplitude Mode)" content="Looks like a skyline. The height of the spikes represents the amplitude of the echoes. Used for precise distance measurements in ophthalmology." />
        </div>
      </div>
    )
  },
  "12.1": {
    title: "Elastography & Contrast",
    narrationScript: "Ultrasound is always evolving. Elastography lets us 'feel' the tissue's stiffness without a biopsy. Contrast agents use microbubbles to light up blood flow. These advanced tools help us see things that standard B-mode might miss.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ElastographyVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Strain Elastography" content="Measures tissue deformation under pressure. Stiff tissues (like many cancers) deform less than soft, healthy tissues." />
            <LectureTag type="Def" label="Shear Wave Elastography" content="Uses a high-intensity pulse to create 'shear waves' that travel horizontally. The speed of these waves tells us the exact stiffness (Young's Modulus)." />
            <LectureTag type="Tip" label="Clinical Use" content="Commonly used for liver fibrosis staging and breast lesion characterization." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Contrast Agents" content="Microscopic gas bubbles (microbubbles) injected into the blood to increase reflectivity and show perfusion." />
            <LectureTag type="Not" label="Non-Linear Oscillation" content="Microbubbles expand more than they contract. This non-linear behavior creates strong harmonic signals." />
          </div>
          <ContrastAgentVisual />
        </div>
      </div>
    ),
    quiz: {
      id: "q12.1",
      type: "mcq",
      question: "Which type of elastography provides a quantitative measurement of tissue stiffness (in kPa or m/s)?",
      options: ["Strain Elastography", "Shear Wave Elastography", "A-Mode Elastography", "Harmonic Elastography"],
      correctAnswer: 1,
      explanation: "Shear Wave Elastography uses high-intensity pulses to generate shear waves; the speed of these waves is measured to provide a quantitative value of tissue stiffness."
    }
  },
  "12.2": {
    title: "Pulse Inversion",
    narrationScript: "Pulse Inversion is a clever way to see only the clear harmonic signals. By sending two pulses—one normal and one inverted—we can cancel out the fundamental frequency and leave only the sharper harmonic image.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Sound Wave Symphony" />
        <div className="mt-12 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal">Deep Dive: Pulse Inversion Technology</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <PulseInversionVisual />
        </div>
        <div className="space-y-6">
          <LectureTag type="Concept" label="Destructive Interference" content="In Pulse Inversion, the fundamental frequencies of the two pulses are out of phase and cancel each other out." />
          <LectureTag type="Def" label="Constructive Interference" content="The harmonic frequencies are in phase and add together, creating a stronger signal for the image." />
          <LectureTag type="Tip" label="Frame Rate" content="Because two pulses are needed per scan line, the frame rate is halved, reducing temporal resolution." />
        </div>
      </div>
    ),
    quiz: {
      id: "q12.2",
      type: "mcq",
      question: "What is the primary trade-off when using Pulse Inversion Harmonic Imaging?",
      options: ["Reduced Axial Resolution", "Reduced Lateral Resolution", "Reduced Temporal Resolution", "Increased Artifacts"],
      correctAnswer: 2,
      explanation: "Pulse Inversion requires two pulses per scan line instead of one, which doubles the time needed to create a frame, thus halving the frame rate and reducing temporal resolution."
    }
  },
  "13.1": {
    title: "Doppler Principles",
    narrationScript: "The Doppler Effect is the change in frequency caused by the motion of a reflector, like a red blood cell. If the cell moves toward the probe, the frequency increases. If it moves away, it decreases. This shift is what allows us to measure blood flow velocity.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="PRF" />
        <DopplerShiftVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Equation" content="Shift = (2 * Velocity * Frequency * cosθ) / Propagation Speed. Note that velocity and frequency are directly proportional to the shift." />
            <LectureTag type="Def" label="Positive Shift" content="Occurs when blood moves toward the transducer. The received frequency is higher than the transmitted frequency." />
            <LectureTag type="Tip" label="The Factor of 2" content="The '2' in the equation represents the two Doppler shifts that occur: one when the sound hits the cell, and one when it reflects back." />
          </div>
          <DopplerAngleVisual />
        </div>
      </div>
    ),
    quiz: {
      id: "q13.1",
      type: "mcq",
      question: "According to the Doppler equation, what happens to the Doppler shift if the transducer frequency is doubled?",
      options: ["The shift is halved", "The shift remains the same", "The shift is doubled", "The shift is quadrupled"],
      correctAnswer: 2,
      explanation: "Transducer frequency is directly proportional to the Doppler shift. If you double the frequency, you double the shift."
    }
  },
  "13.2": {
    title: "Color & Spectral Doppler",
    narrationScript: "We use different Doppler modes for different clinical needs. Color Doppler gives us a 2D map of flow, while Spectral Doppler gives us precise velocity measurements over time. Remember BART: Blue Away, Red Toward!",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ColorDopplerVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Color Doppler" content="Provides qualitative information about flow direction and mean velocity. It uses 'autocorrelation' to process signals." />
            <LectureTag type="Def" label="Spectral Doppler" content="Provides quantitative information about peak velocities. It uses Fast Fourier Transform (FFT) for processing." />
            <LectureTag type="Tip" label="BART Mnemonic" content="Blue Away, Red Toward. This is the standard map, though it can be inverted by the sonographer." />
          </div>
        </div>
        <SpectralDopplerVisual />
      </div>
    ),
    quiz: {
      id: "q13.2",
      type: "mcq",
      question: "Which mathematical process is used to extract the individual frequencies from a complex Spectral Doppler signal?",
      options: ["Autocorrelation", "Demodulation", "Fast Fourier Transform (FFT)", "Pulse Inversion"],
      correctAnswer: 2,
      explanation: "FFT is the digital technique used to process pulsed and continuous wave Doppler signals to create the spectral display."
    }
  },
  "14.1": {
    title: "Imaging Artifacts",
    narrationScript: "Artifacts are things we see on the screen that don't match the actual anatomy. They can be helpful or misleading. Understanding why they happen—like reverberation or shadowing—is a core part of being a skilled sonographer.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <ArtifactsVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Reverberation" content="Multiple reflections between two strong reflectors. Appears as equally spaced lines like a ladder." />
            <LectureTag type="Def" label="Shadowing" content="A dark area posterior to a highly attenuating structure (like a gallstone). It happens because the sound is absorbed or reflected." />
            <LectureTag type="Tip" label="Enhancement" content="The opposite of shadowing. A bright area posterior to a low-attenuating structure (like a cyst)." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Not" label="Mirror Image" content="Sound reflects off a strong curved reflector (like the diaphragm) and creates a duplicate image deeper than the real one." />
            <LectureTag type="Concept" label="Comet Tail" content="A form of reverberation with very closely spaced reflections. Often seen with metallic objects or gas bubbles." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q14.1",
      type: "mcq",
      question: "Which artifact is caused by a sound wave reflecting off a strong, smooth, curved boundary like the diaphragm?",
      options: ["Shadowing", "Enhancement", "Mirror Image", "Reverberation"],
      correctAnswer: 2,
      explanation: "Mirror image artifacts occur when sound reflects off a strong specular reflector, creating a false image on the other side of the reflector."
    }
  },
  "14.2": {
    title: "Doppler Artifacts",
    narrationScript: "Doppler has its own set of artifacts. Aliasing is the most common—it's when the flow is too fast for the system to sample correctly. We also see ghosting and clutter from tissue motion. Knowing how to fix these is key to a clean study.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <AliasingVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Aliasing" content="The most common Doppler artifact. Occurs when the Doppler shift exceeds the Nyquist limit (PRF/2)." />
            <LectureTag type="Def" label="Ghosting (Clutter)" content="Low-frequency Doppler shifts caused by tissue motion (like vessel walls) rather than blood flow." />
            <LectureTag type="Tip" label="Fixing Aliasing" content="Increase the PRF (scale), use a lower frequency transducer, or shift the baseline." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Not" label="Mirror Image (Doppler)" content="Also called 'crosstalk'. Appears as a symmetric signal on both sides of the baseline. Usually caused by high Doppler gain or a 90° angle." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q14.2",
      type: "mcq",
      question: "What is the Nyquist limit for a pulsed Doppler system with a PRF of 10,000 Hz?",
      options: ["5,000 Hz", "10,000 Hz", "20,000 Hz", "2,500 Hz"],
      correctAnswer: 0,
      explanation: "The Nyquist limit is always half of the Pulse Repetition Frequency (PRF/2). For a PRF of 10,000 Hz, the limit is 5,000 Hz."
    }
  },
  "15.1": {
    title: "Bioeffects & Safety",
    narrationScript: "While ultrasound is generally safe, it is a form of energy. We must always follow the ALARA principle: As Low As Reasonably Achievable. We monitor Thermal and Mechanical Indices to ensure we're not causing harm to the patient.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SafetyIndicesVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="ALARA Principle" content="Minimize scan time and output power while still obtaining diagnostic information." />
            <LectureTag type="Def" label="Thermal Index (TI)" content="Relates to the potential for tissue heating. TI = Output Power / Power needed to raise temp by 1°C." />
            <LectureTag type="Tip" label="Mechanical Index (MI)" content="Relates to the potential for cavitation (bubble formation). MI = Peak Rarefactional Pressure / √Frequency." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Stable Cavitation" content="Microbubbles oscillate but do not burst. Causes microstreaming in surrounding fluid." />
            <LectureTag type="Not" label="Transient Cavitation" content="Bubbles burst violently (implosion). Also called 'normal' or 'inertial' cavitation. Causes highly localized damage." />
          </div>
          <BioeffectMechanismsVisual />
        </div>
      </div>
    ),
    quiz: {
      id: "q15.1",
      type: "mcq",
      question: "Which bioeffect mechanism is most closely associated with the Peak Rarefactional Pressure of the ultrasound wave?",
      options: ["Thermal Effects", "Absorption", "Cavitation", "Attenuation"],
      correctAnswer: 2,
      explanation: "Cavitation (the formation and behavior of gas bubbles) is primarily driven by the peak rarefactional pressure of the wave, which is reflected in the Mechanical Index (MI)."
    }
  }
};

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

// --- DASHBOARD HUD ---
const DashboardHUD: React.FC<{ progress: number; isDarkMode: boolean }> = ({ progress, isDarkMode }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
      {[
        { label: 'Neural Sync', value: '98.4%', icon: Activity, color: 'text-registry-teal' },
        { label: 'Core Temp', value: '36.5°C', icon: HeartPulse, color: 'text-registry-rose' },
        { label: 'Signal SNR', value: '42dB', icon: Radio, color: 'text-registry-amber' },
        { label: 'Uptime', value: '142h', icon: Timer, color: 'text-registry-cobalt' },
      ].map((stat, i) => (
        <div key={i} className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 rounded-2xl shadow-sm group hover:border-registry-teal/30 transition-all relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-registry-teal/20 to-transparent animate-scan" />
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <div className="w-1 h-1 bg-registry-teal rounded-full animate-pulse" />
          </div>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
          <p className={`text-lg font-black italic tracking-tighter mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// --- NEURAL MAP ---
const NeuralMap: React.FC<{ modules: Module[], completed: Set<string>, isDarkMode?: boolean }> = ({ modules, completed, isDarkMode }) => {
  return (
    <div className={`relative h-64 w-full rounded-[2.5rem] border overflow-hidden neural-grid group relative z-10 ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="absolute inset-0 scanline opacity-20" />
      <div className="absolute top-4 left-6 flex items-center space-x-2">
        <div className="w-2 h-2 bg-registry-teal rounded-full animate-ping" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Node Network</span>
      </div>
      
      <svg className="w-full h-full p-12">
        {/* Connections */}
        {modules.map((m, i) => {
          if (i === modules.length - 1) return null;
          const x1 = 15 + (i * (70 / (modules.length - 1)));
          const x2 = 15 + ((i + 1) * (70 / (modules.length - 1)));
          return (
            <line 
              key={`line-${i}`}
              x1={`${x1}%`} y1="50%" x2={`${x2}%`} y2="50%"
              stroke="currentColor" strokeWidth="1"
              className="text-slate-200 dark:text-white/5"
            />
          );
        })}
        
        {/* Nodes */}
        {modules.map((m, i) => {
          const x = 15 + (i * (70 / (modules.length - 1)));
          const isModuleCompleted = m.lessons.every(l => completed.has(l.id));
          return (
            <g key={`node-${i}`} className="cursor-help">
              <circle 
                cx={`${x}%`} cy="50%" r="12" 
                className={`${isModuleCompleted ? 'fill-registry-teal' : 'fill-slate-200 dark:fill-white/10'} transition-all duration-500`}
              />
              {isModuleCompleted && (
                <circle 
                  cx={`${x}%`} cy="50%" r="18" 
                  className="fill-registry-teal/20 animate-pulse"
                />
              )}
              <text 
                x={`${x}%`} y="75%" 
                textAnchor="middle" 
                className={`text-[8px] font-black uppercase tracking-tighter ${isDarkMode ? 'fill-slate-400' : 'fill-slate-600'}`}
              >
                {m.title.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 right-6 text-right">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Integrity</p>
        <p className="text-xs font-mono text-registry-teal">99.98%</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isIntroFinished, setIsIntroFinished] = useState(() => localStorage.getItem('spi_intro_finished') === 'true');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('spi_theme_mode') === 'dark');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('spi_theme_name') || 'registry');
  const [current, setCurrent] = useState<[number, number] | null>(null);
  const [showModuleIntro, setShowModuleIntro] = useState<number | null>(null);
  const [showLessonIntro, setShowLessonIntro] = useState<boolean>(false);
  const [showTabIntro, setShowTabIntro] = useState<boolean>(false);
  const [tabIntroTitle, setTabIntroTitle] = useState<string>('');
  const [activeOverlay, setActiveOverlay] = useState<'sidebar' | 'tutor' | 'reminders' | 'flashcards' | 'glossary' | 'plan' | 'profile' | 'legal' | 'exam' | 'pricing' | 'radio' | 'settings' | 'quest' | null>(null);
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
        'profile': 'Operator Profile Sync',
        'legal': 'Compliance Protocols',
        'pricing': 'Mastery Access Protocol',
        'radio': 'Neural Frequency Node',
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
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem('spi_completed') || '[]')));
  const [profile, setProfile] = useState<any>(() => {
    const defaultProfile = { 
      dailyInsight: '', 
      lastInsightTimestamp: 0, 
      scriptVault: [],
      companionSkin: 'default',
      profileAvatar: 'default'
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

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.completed) setCompleted(new Set(data.completed));
          if (data.profile) setProfile(data.profile);
          if (data.streak) setStreak(data.streak);
          if (data.completedToday !== undefined) setCompletedToday(data.completedToday);
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    const saveData = async () => {
      try {
        await fetch(`/api/user/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completed: Array.from(completed),
            profile,
            streak,
            completedToday
          })
        });
      } catch (error) {
        console.error("Save error:", error);
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
    setCompleted(prev => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev).add(lessonId);
      
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
      return next;
    });
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

  const handleProfileUpdate = (updates: Partial<UserProfileType>) => {
    setProfile((prev: any) => ({ ...prev, ...updates }));
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
          } catch (e) {
            console.error("Insight Error", e);
            updateDailyInsight("Mastering acoustic impedance is key to reflection.");
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
  const [bgImage, setBgImage] = useState<string | null>(() => localStorage.getItem('registry_bg_image'));
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);

  useEffect(() => {
    if (bgImage) {
      localStorage.setItem('registry_bg_image', bgImage);
    } else {
      localStorage.removeItem('registry_bg_image');
    }
  }, [bgImage]);
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

    // Check for API key if not using cached audio
    const cachedAudio = await AudioCache.get(lessonId);
    if (!cachedAudio && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsTtsLoading(true);
    try {
      let base64Audio = await AudioCache.get(lessonId);
      
      if (!base64Audio && userId) {
        try {
          const res = await fetch(`/api/audio/${userId}/${lessonId}`);
          if (res.ok) {
            const json = await res.json();
            base64Audio = json.data;
            if (base64Audio) await AudioCache.set(lessonId, base64Audio);
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
              const scriptText = await generateText(`Generate a full, detailed ultrasound physics lecture for the SPI exam based on this summary: "${script}". The lecture should be professional, authoritative, and cover key concepts, definitions, and clinical tips in depth. Aim for about 300-400 words. Speak as a mature professional educator.`);
              if (scriptText) {
                finalScript = scriptText;
              }
            } catch (scriptErr) {
              console.error("Full lecture script generation failed, falling back to summary", scriptErr);
            }
          }

          base64Audio = await generateSpeech(`Mature professional educator with a deep, authoritative voice: ${finalScript}`, 'Charon');
        } catch (constructErr) {
          console.error("AI failed in handlePlayLecture", constructErr);
        }

        if (base64Audio) {
          await AudioCache.set(lessonId, base64Audio);
          setCachedLessons(prev => new Set([...prev, lessonId]));
          if (userId) {
            fetch(`/api/audio/${userId}/${lessonId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: base64Audio })
            }).catch(console.error);
          }
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
    } catch (err) {
      console.error("TTS Error:", err);
      toast.error("Failed to generate lecture audio. Please check your connection.");
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

  const themes = {
    registry: {
      name: 'Registry Default',
      primary: '#00e5ff',
      secondary: '#00b8d4',
      accent: '#ff2e63',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#080c14' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#0f172a'
    },
    midnight: {
      name: 'Midnight Gold',
      primary: '#ffd700',
      secondary: '#b8860b',
      accent: '#ffd700',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-white',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#080c14' : '#ffffff',
      textHex: isDarkMode ? '#ffffff' : '#0f172a'
    },
    ruby: {
      name: 'Ruby Mastery',
      primary: '#ff2e63',
      secondary: '#e11d48',
      accent: '#fb7185',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#080c14' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#0f172a'
    },
    amethyst: {
      name: 'Amethyst Study',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#05070a' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#0f172a'
    },
    teal: {
      name: 'Teal Core',
      primary: '#00d2ff',
      secondary: '#00a8cc',
      accent: '#00e5ff',
      bg: 'bg-slate-50/50 dark:bg-stealth-950',
      text: 'text-slate-900 dark:text-slate-100',
      border: 'tech-border',
      card: 'glass-card',
      bgHex: isDarkMode ? '#05070a' : '#ffffff',
      textHex: isDarkMode ? '#f1f5f9' : '#0f172a'
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
            const base64 = await generateSpeech(`Mature professional educator: ${content.narrationScript}`, 'Charon');
            if (base64) {
              await AudioCache.set(lesson.id, base64);
              setCachedLessons(prev => new Set([...prev, lesson.id]));
              
              // Save to server
              if (userId) {
                fetch(`/api/audio/${userId}/${lesson.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ data: base64 })
                }).catch(console.error);
              }
            }
          } catch (e) {
            console.error("Background caching failed", e);
          }
        })();
      }
    }
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
            const base64 = await generateSpeech(`Mature professional educator: ${content.narrationScript}`, 'Charon');
            if (base64) {
              await AudioCache.set(lesson.id, base64);
              setCachedLessons(prev => new Set([...prev, lesson.id]));
              
              // Save to server
              if (userId) {
                fetch(`/api/audio/${userId}/${lesson.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ data: base64 })
                }).catch(console.error);
              }
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
    
    for (const lesson of allLessons) {
      if (!cachedLessons.has(lesson.id)) {
        const content = lessonContent[lesson.id];
        if (content?.narrationScript) {
          try {
            const base64 = await generateSpeech(`Mature professional educator: ${content.narrationScript}`, 'Charon');
            if (base64) {
              await AudioCache.set(lesson.id, base64);
              setCachedLessons(prev => new Set([...prev, lesson.id]));

              // Save to server
              if (userId) {
                fetch(`/api/audio/${userId}/${lesson.id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ data: base64 })
                }).catch(console.error);
              }
            }
          } catch (e) {
            console.error(`Global caching failed for ${lesson.id}`, e);
          }
        }
      }
    }
    
    setIsCachingAll(false);
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
  const lessonData = curLesson ? (lessonContent[curLesson.id] || { title: curLesson.title, content: <div className="p-20 text-center opacity-20 uppercase font-black">Initializing...</div> } as LessonData) : null;
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

      {/* Theme Toggle in Intro */}
      <div className="absolute top-8 right-8 z-[510]">
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
          <span className="text-registry-teal text-[10px] font-black uppercase tracking-[0.8em]">Neural Interface v5.0</span>
          <div className="h-[1px] w-8 bg-registry-teal/50" />
        </motion.div>

        {/* Massive Cinematic Title */}
        <div className="relative mb-12 overflow-hidden">
          <motion.h1 
            initial={{ y: '100%', skewY: 10 }}
            animate={{ y: 0, skewY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`text-4xl sm:text-7xl md:text-[15vw] font-black ${isDarkMode ? 'text-white' : 'text-slate-950'} tracking-tighter italic uppercase text-center leading-[0.85] select-none`}
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

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.2, duration: 1 }}
          className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-xs md:text-lg font-medium tracking-widest uppercase text-center max-w-2xl mb-16`}
        >
          {profile?.name ? (
            <span className="text-registry-teal">Welcome back, {profile.name}. <br/></span>
          ) : null}
          Advanced Ultrasound Physics & Instrumentation <br/>
          <span className="text-registry-teal/60 italic">Registry Preparation Protocol</span>
        </motion.p>
        
        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col items-center space-y-6"
        >
           <button 
             onClick={() => setIsIntroFinished(true)} 
             className={`group relative px-20 py-8 overflow-hidden rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-white text-slate-950' : 'bg-stealth-900 text-white shadow-2xl shadow-stealth-900/20'}`}
           >
             <div className="absolute inset-0 bg-registry-teal translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
             <span className="relative font-black uppercase tracking-[0.4em] text-sm group-hover:text-white transition-colors duration-300">Initialize Core</span>
           </button>
           
           {localStorage.getItem('spi_intro_finished') === 'true' && (
             <button 
               onClick={() => setIsIntroFinished(true)}
               className="text-[10px] font-black uppercase tracking-widest text-registry-teal hover:text-registry-rose transition-colors"
             >
               Quick Resume
             </button>
           )}
        </motion.div>
      </motion.div>
      
      {/* Bottom Meta Data */}
      <div className={`absolute bottom-12 left-0 right-0 flex justify-between px-12 items-end ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        <div className="flex flex-col space-y-1">
          <span className="text-[8px] font-black text-registry-teal/40 uppercase tracking-widest">System Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest">All Nodes Operational</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end space-y-1">
          <span className="text-[8px] font-black text-registry-teal/40 uppercase tracking-widest">Encryption Level</span>
          <span className="text-[10px] font-mono uppercase tracking-widest">256-Bit Quantum Secure</span>
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
           className={`w-32 h-32 md:w-64 md:h-64 mx-auto bg-gradient-to-br ${modules[showModuleIntro].color} rounded-[3rem] md:rounded-[5rem] flex items-center justify-center text-white shadow-[0_0_120px_rgba(0,210,255,0.5)] border border-white/20 relative group`}
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
              <div className={`h-[1px] w-12 ${isDarkMode ? 'bg-white/20' : 'bg-slate-200'}`} />
              <span className="text-registry-teal font-black tracking-[0.6em] uppercase text-[10px] md:text-xs">Module Access Granted</span>
              <div className={`h-[1px] w-12 ${isDarkMode ? 'bg-white/20' : 'bg-slate-200'}`} />
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
              className="text-slate-400 text-sm md:text-xl font-medium tracking-widest uppercase italic"
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
    <div className={`flex flex-col lg:flex-row h-screen overflow-hidden transition-colors duration-300 ${currentThemeData.bg} ${currentThemeData.text}`}>
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
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.15)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.05)_0%,transparent_70%)]'}`} />
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
                  <span className="text-registry-teal text-[10px] font-black uppercase tracking-[1em]">Briefing Protocol</span>
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
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[10px] font-black uppercase tracking-[0.4em]`}>Neural Sync in Progress...</span>
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
                <span className="text-registry-teal text-[10px] font-black uppercase tracking-[1.2em] animate-pulse">Node Access</span>
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
                className="mt-4 text-registry-teal/60 text-[8px] font-mono uppercase tracking-widest"
              >
                Decryption Complete // Protocol Active
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SonarPulse />
      <div className="scanline" />
      
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-80 bg-stealth-950 text-slate-100 border-r border-white/5 overflow-y-auto shrink-0 relative z-30`}>
        <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
        
        {/* Diagnostic Header */}
        <div className="sticky top-0 z-20 bg-stealth-950/95 backdrop-blur-xl border-b border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-registry-teal">System Active</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-500">
              <Activity className="w-3 h-3" />
              <span className="text-[8px] font-mono tracking-tighter">NODE_STABLE</span>
            </div>
          </div>
          
          <button onClick={() => setCurrent(null)} className="flex items-center space-x-4 w-full group">
            <div className="w-12 h-12 bg-registry-teal rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shadow-registry-teal/20">
              <Home className="text-white w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                <span className="text-registry-rose">SPI</span> MASTER
              </h1>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Diagnostic Console v5.2</p>
            </div>
          </button>
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Neural Load Indicator */}
          <div className={`p-5 ${isDarkMode ? 'bg-stealth-900/50' : 'bg-slate-50'} rounded-[2rem] border ${isDarkMode ? 'border-white/5' : 'border-slate-100'} transition-all group relative overflow-hidden`}>
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-registry-teal/30 to-transparent animate-scan" />
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3 h-3 text-registry-teal" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-black uppercase tracking-widest`}>Neural Load</span>
                </div>
                <span className="text-sm font-black italic tracking-tighter text-registry-teal">{Math.round(progressPercent)}%</span>
             </div>
             <div className={`w-full h-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'} rounded-full overflow-hidden`}>
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 className="h-full bg-registry-teal shadow-[0_0_10px_rgba(0,210,255,0.5)]" 
               />
             </div>
             <p className={`text-[7px] font-black ${isDarkMode ? 'text-slate-600' : 'text-slate-400'} uppercase tracking-widest mt-3 text-center opacity-60 group-hover:opacity-100 transition-opacity`}>Syncing with ARDMS Core...</p>
          </div>

          <nav className="space-y-8">
            <div className="space-y-4">
              <h4 className={`text-[9px] font-black uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} tracking-[0.4em] px-2 flex items-center justify-between`}>
                <span>Curriculum Nodes</span>
                <Layers className="w-3 h-3 opacity-30" />
              </h4>
              <div className="space-y-6">
                {modules.map((m, mIdx) => (
                  <div key={mIdx} className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                           <div className="flex items-center space-x-3">
                             <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${m.color}`} />
                             <h3 className={`font-black text-[10px] uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.title}</h3>
                           </div>
                           <div className="flex items-center space-x-2">
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleCacheModule(mIdx); }}
                               disabled={cachingModules.has(mIdx)}
                               className={`p-1 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'} rounded text-[8px] font-black uppercase transition-colors ${cachingModules.has(mIdx) ? 'text-registry-teal animate-pulse' : isDarkMode ? 'text-slate-600 hover:text-registry-teal' : 'text-slate-400 hover:text-registry-teal'}`}
                               title="Cache Module Audio"
                             >
                               {cachingModules.has(mIdx) ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Download className="w-2.5 h-2.5" />}
                             </button>
                             <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{m.weight}</span>
                           </div>
                        </div>
                    <div className={`space-y-1 ml-2 border-l ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pl-4`}>
                      {m.lessons.map((l, lIdx) => (
                        <button 
                          key={lIdx} 
                          onClick={() => handleLessonSelect(mIdx, lIdx)} 
                          className={`w-full text-left p-2.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-between group ${current?.[0] === mIdx && current?.[1] === lIdx ? 'bg-registry-teal/10 text-registry-teal border border-registry-teal/20' : isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                          <span className="truncate group-hover:translate-x-1 transition-transform">{l.title}</span>
                          <div className="flex items-center space-x-2">
                            {cachedLessons.has(l.id) && (
                              <Volume2 className="w-2.5 h-2.5 text-teal-500/50" />
                            )}
                            {completed.has(l.id) ? (
                              <CheckCircle className="w-3 h-3 text-teal-500" />
                            ) : (
                              <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-stealth-800' : 'bg-slate-200'}`} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-[0.4em] px-2">Strategic Protocols</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, overlay: null, isHome: true },
                  { id: 'plan', label: 'Strategic Plan', icon: Calendar, overlay: 'plan' },
                  { id: 'tutor', label: 'Harvey AI Tutor', icon: Cpu, overlay: 'tutor', isAvatar: true },
                  { id: 'exam', label: 'Mock Exam', icon: Trophy, overlay: 'exam' },
                  { id: 'flashcards', label: 'Neural Flashcards', icon: Layers, overlay: 'flashcards' },
                  { id: 'glossary', label: 'Physics Lexicon', icon: Book, overlay: 'glossary' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      if (item.isHome) { setActiveOverlay(null); setCurrent(null); }
                      else setActiveOverlay(item.overlay as any);
                    }} 
                    className={`w-full flex items-center space-x-3 p-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${((item.isHome && current === null && activeOverlay === null) || activeOverlay === item.overlay) ? 'bg-registry-teal/10 text-registry-teal border border-registry-teal/20' : isDarkMode ? 'text-slate-500 hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                  >
                    {item.isAvatar ? (
                      <div className="scale-[0.4] -mx-5"><CompanionAvatar state="idle" /></div>
                    ) : (
                      <item.icon className="w-4 h-4" />
                    )}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'} space-y-4`}>
              <h4 className={`text-[9px] font-black uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} tracking-[0.4em] px-2`}>System Nodes</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'profile', label: 'User Profile', icon: User, overlay: 'profile' },
                  { id: 'radio', label: 'Neural Radio', icon: Radio, overlay: 'radio' },
                  { id: 'settings', label: 'Settings', icon: SettingsIcon, overlay: 'settings' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveOverlay(item.overlay as any)} 
                    className={`w-full flex items-center space-x-3 p-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeOverlay === item.overlay ? 'bg-registry-teal/10 text-registry-teal border border-registry-teal/20' : isDarkMode ? 'text-slate-500 hover:bg-white/5 border border-transparent' : 'text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button 
                  onClick={() => setActiveOverlay('pricing')} 
                  className={`w-full flex items-center space-x-3 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-registry-teal text-white shadow-lg shadow-registry-teal/20' : 'bg-slate-900 text-white shadow-md'} hover:scale-[1.02] active:scale-[0.98] mt-4`}
                >
                  <Crown className="w-4 h-4" /> <span>Mastery Access</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-stealth-950/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} px-4 md:px-10 py-4 md:py-5 flex items-center justify-between shrink-0`}>
          <div className="flex items-center space-x-3 md:space-x-6 overflow-hidden">
            <button onClick={() => setActiveOverlay('sidebar')} className={`lg:hidden p-2.5 ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'} border rounded-xl clinical-shadow shrink-0`}>
              <Menu className="w-5 h-5 text-registry-teal" />
            </button>
            <div className="flex flex-col min-w-0">
               <div className="flex items-center space-x-2 mb-1">
                 <div className="w-1 h-1 bg-registry-teal rounded-full animate-pulse" />
                 <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest truncate`}>
                   {current ? `Module ${current[0] + 1} // Node ${current[1] + 1}` : 'System Overview'}
                 </span>
               </div>
               <h2 className={`text-sm md:text-2xl font-black uppercase italic tracking-tighter truncate leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 {current ? lessonData?.title : 'Registry Dashboard'}
               </h2>
            </div>
            {current && (
              <div className="hidden sm:flex items-center space-x-1 ml-4">
                <button 
                  onClick={handlePrevLesson}
                  disabled={!getPrevLesson()}
                  className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 disabled:opacity-10' : 'hover:bg-slate-100 text-slate-500 disabled:opacity-20'}`}
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className={`w-px h-4 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                <button 
                  onClick={handleNextLesson}
                  disabled={!getNextLesson()}
                  className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400 disabled:opacity-10' : 'hover:bg-slate-100 text-slate-500 disabled:opacity-20'}`}
                  title="Next Lesson"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className={`hidden xl:flex items-center space-x-6 mr-6 pr-6 border-r ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>Signal Strength</span>
                  <div className="flex items-end space-x-0.5 h-3 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`w-1 rounded-t-sm ${i <= 4 ? 'bg-registry-teal' : isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`} style={{ height: `${i * 20}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>Sync Status</span>
                  <span className="text-[10px] font-mono text-registry-teal uppercase tracking-widest mt-0.5">Optimal</span>
                </div>
             </div>
             {(current || (!activeOverlay && isIntroFinished)) && (
               <button 
                 onClick={() => {
                   const script = current ? lessonData?.narrationScript : staticNarrationScripts.dashboard;
                   const id = current ? curLesson!.id : 'dashboard';
                   if (script) handlePlayLecture(script, id);
                 }} 
                 disabled={isTtsLoading} 
                 className={`p-2.5 md:p-3 rounded-xl text-white transition-all shadow-md ${isNarrating ? 'bg-registry-rose animate-pulse' : 'bg-registry-teal shadow-registry-teal/20'}`}
               >
                 {isTtsLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : isNarrating ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
               </button>
             )}
              <button 
                onClick={handleTestAudio}
                className={`hidden md:flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-registry-teal hover:bg-registry-teal/10' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-registry-teal hover:bg-slate-200'} rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm`}
              >
                <Volume2 className="w-3 h-3" />
                <span>Test Audio</span>
              </button>
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 md:p-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'} rounded-xl shadow-sm transition-colors`}>
               {isDarkMode ? <Sun className="w-5 h-5 text-registry-amber" /> : <Moon className="w-5 h-5 text-registry-teal" />}
             </button>
             <FullscreenToggle className="flex" iconClassName="w-4 h-4 md:w-5 md:h-5 text-registry-teal" />
             <button 
               onClick={() => setActiveOverlay('settings')}
                className={`p-2.5 md:p-3 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} rounded-xl shadow-sm hover:bg-white/10 transition-colors group`}
               title="System Settings"
             >
               <SettingsIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} group-hover:text-registry-teal transition-colors`} />
             </button>
             <button 
               onClick={() => setActiveOverlay('pricing')}
               className={`hidden md:flex items-center space-x-2 px-6 py-3 ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'} rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95`}
             >
               <Crown className="w-4 h-4 text-registry-teal" />
               <span>Mastery Access</span>
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide pb-28 lg:pb-12 relative">
          <ParallaxBackground isDarkMode={isDarkMode} bgImage={bgImage} />
          <div className="max-w-5xl xl:max-w-7xl 2xl:max-w-[1800px] mx-auto w-full px-4 md:px-12 py-6 md:py-12 relative z-10">
            {current ? (
              <>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <button 
                    onClick={() => setCurrent(null)}
                    className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500 hover:text-registry-teal' : 'text-slate-400 hover:text-registry-teal'} transition-colors group`}
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                  </button>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Module Progress</span>
                      <span className="text-[10px] font-black text-registry-teal italic">{Math.round(moduleProgress[curModule!.title])}%</span>
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

                <div className="mb-12 flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-hide relative z-10">
                  {curModule!.lessons.map((lesson, idx) => {
                    const isCompleted = completed.has(lesson.id);
                    const isActive = current[1] === idx;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(current[0], idx)}
                        className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${
                          isActive 
                            ? 'bg-registry-teal/10 border-registry-teal text-registry-teal' 
                            : isCompleted 
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' 
                              : isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-registry-teal animate-pulse' : isCompleted ? 'bg-emerald-500' : 'bg-current opacity-30'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Node {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="lesson-content-transition overflow-x-hidden w-full">{lessonData?.content}</div>
                
                {/* Mobile Sticky Navigation */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-2 p-2 bg-stealth-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                  <button 
                    onClick={handlePrevLesson}
                    disabled={!getPrevLesson()}
                    className="p-3 bg-white/5 text-slate-400 rounded-xl disabled:opacity-20 active:scale-90 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="px-4 border-x border-white/10">
                    <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest text-center">Node {current[1] + 1} / {curModule!.lessons.length}</p>
                  </div>
                  <button 
                    onClick={handleNextLesson}
                    disabled={!getNextLesson()}
                    className="p-3 bg-registry-teal text-stealth-950 rounded-xl disabled:opacity-20 active:scale-90 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handlePrevLesson}
                      disabled={!getPrevLesson()}
                      className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'} rounded-2xl disabled:opacity-20 hover:bg-white/10 hover:text-white hover:border-registry-teal/30 transition-all flex items-center space-x-2 shadow-sm active:scale-95 group`}
                    >
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Previous Node</span>
                    </button>
                    <button 
                      onClick={handleNextLesson}
                      disabled={!getNextLesson()}
                      className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'} rounded-2xl disabled:opacity-20 hover:bg-white/10 hover:text-white hover:border-registry-teal/30 transition-all flex items-center space-x-2 shadow-sm active:scale-95 group`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">Next Node</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {!completed.has(curLesson!.id) && (
                    <button 
                      onClick={() => markComplete(curLesson!.id)}
                      className="w-full md:w-auto px-10 py-5 bg-registry-teal/80 hover:bg-registry-teal text-white rounded-[2rem] font-black italic uppercase text-xs tracking-[0.2em] shadow-xl shadow-registry-teal/20 transition-all flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Mark Node Complete</span>
                    </button>
                  )}
                </div>

                {lessonData?.quiz && (
                  <div className="mt-24 md:mt-32">
                    <div className="mb-10 text-center">
                      <span className="text-[10px] font-black uppercase text-registry-teal tracking-[0.5em]">Knowledge Validation</span>
                      <h4 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mt-4">Module Assessment</h4>
                    </div>
                    <AdvancedQuiz question={lessonData.quiz} onComplete={() => markComplete(curLesson!.id)} isDarkMode={isDarkMode} />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-8 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="space-y-8 md:space-y-16">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Waves className="w-5 h-5 text-registry-teal" />
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Acoustic Interface</h3>
                      </div>
                      <InteractiveWave isDarkMode={isDarkMode} />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Activity className="w-5 h-5 text-registry-rose" />
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Neural Load</h3>
                      </div>
                      <NeuralLoad data={neuralLoadData} isDarkMode={isDarkMode} />
                    </div>
                  </div>

                 <DashboardHUD progress={progressPercent} isDarkMode={isDarkMode} />

                 {/* Clinical Pearl of the Day */}
                 <motion.section 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className={`relative p-8 md:p-12 ${isDarkMode ? 'bg-registry-cobalt/10 border-registry-cobalt/20' : 'bg-registry-cobalt/5 border-registry-cobalt/10'} border-2 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden group hover:shadow-xl transition-all duration-500`}
                 >
                   <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Stethoscope className="w-24 h-24 text-registry-cobalt -rotate-12" />
                   </div>
                   <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-registry-cobalt/20 rounded-xl">
                         <Zap className="w-5 h-5 text-registry-cobalt" />
                       </div>
                       <div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-registry-cobalt/60">Clinical Pearl of the Day</span>
                         <h4 className="text-xl font-black italic uppercase tracking-tighter text-registry-cobalt">
                           {CLINICAL_TIPS[new Date().getDate() % CLINICAL_TIPS.length].title}
                         </h4>
                       </div>
                     </div>
                     <p className={`text-lg md:text-xl font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                       "{CLINICAL_TIPS[new Date().getDate() % CLINICAL_TIPS.length].content}"
                     </p>
                     <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-registry-cobalt/20 rounded-full text-[8px] font-black uppercase tracking-widest text-registry-cobalt">
                         Category: {CLINICAL_TIPS[new Date().getDate() % CLINICAL_TIPS.length].category}
                       </span>
                     </div>
                   </div>
                 </motion.section>
                 
                  {/* Mission Manifesto */}
                  <motion.section 
                    whileHover={{ scale: 1.005 }}
                    className={`relative p-8 md:p-16 ${currentThemeData.bg} rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border ${isDarkMode ? 'border-white/5' : 'border-slate-200'} transition-all duration-500 hover:shadow-registry-teal/10`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.15),transparent_70%)]" />
                    <div className="relative z-10 text-center space-y-8">
                       <div className="flex items-center justify-center space-x-4">
                          <div className="h-[1px] w-8 md:w-16 bg-registry-teal/50" />
                          <span className="text-registry-teal text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">Mission Protocol</span>
                          <div className="h-[1px] w-8 md:w-16 bg-registry-teal/50" />
                       </div>
                       
                       <div className="inline-block px-3 py-1 bg-registry-rose/20 border border-registry-rose/30 rounded-full mb-4">
                         <span className="text-[8px] font-black uppercase text-registry-rose tracking-widest">Phase 3: Advanced Instrumentation</span>
                       </div>
                       
                       <div className="space-y-4">
                          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] bg-gradient-to-r from-registry-rose via-registry-teal to-registry-rose bg-clip-text text-transparent">
                            Stay. Breathe.
                          </h2>
                          <p className="text-registry-teal text-sm md:text-xl font-black uppercase tracking-widest opacity-80">
                            You're allowed to make mistakes
                          </p>
                       </div>

                       <div className="max-w-2xl mx-auto space-y-6">
                          <div className={`p-6 border-y ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                             <p className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} italic leading-tight`}>
                                "Our job is to prepare you. Your job is to remember how we fail you so that when it is your turn, you do better."
                             </p>
                          </div>
                       </div>

                       <div className="flex justify-center">
                          <div className="px-4 py-1 bg-registry-teal/10 border border-registry-teal/20 rounded-full">
                             <span className="text-[8px] md:text-[10px] font-mono text-registry-teal uppercase tracking-widest">Registry Readiness Commitment</span>
                          </div>
                       </div>
                    </div>
                    <ShieldCheck className="absolute -bottom-10 -right-10 w-48 md:w-96 h-48 md:h-96 text-white/5 -rotate-12" />
                  </motion.section>

                 <NeuralMap modules={modules} completed={completed} isDarkMode={isDarkMode} />

                 {/* Mobile Dashboard: Daily Insight */}
                 <motion.section 
                   whileHover={{ scale: 1.005 }}
                   className="bg-white dark:bg-stealth-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-16 text-slate-900 dark:text-white relative overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/5 transition-all duration-500 hover:shadow-registry-teal/10"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/10 dark:from-registry-teal/20 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-6 md:space-y-10">
                      <div className="flex items-center space-x-3">
                         <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20"><Quote className="w-5 h-5 md:w-10 md:h-10 text-registry-teal" /></div>
                         <h3 className="text-xl md:text-4xl font-black uppercase italic tracking-tighter">Daily Principle</h3>
                      </div>
                      <p className="text-xl md:text-5xl font-bold leading-[1.1] max-w-3xl text-slate-800 dark:text-teal-50 tracking-tight italic">
                        {profile?.dailyInsight || "Syncing with registry servers..."}
                      </p>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex items-center space-x-3 text-[8px] md:text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.3em]">
                          <span className="w-2 h-2 md:w-3 md:h-3 bg-registry-teal rounded-full animate-ping" />
                          <span>Core High-Yield Knowledge</span>
                        </div>
                        <button 
                          onClick={() => {
                            // Find first uncompleted lesson
                            for (let m = 0; m < modules.length; m++) {
                              for (let l = 0; l < modules[m].lessons.length; l++) {
                                if (!completed.has(modules[m].lessons[l].id)) {
                                  handleLessonSelect(m, l);
                                  return;
                                }
                              }
                            }
                            handleLessonSelect(0, 0);
                          }}
                          className="px-6 py-3 bg-registry-teal/80 hover:bg-registry-teal text-white rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-registry-teal/20 transition-all flex items-center space-x-2"
                        >
                          <Play className="w-3 h-3" />
                          <span>Continue Learning</span>
                        </button>
                      </div>
                    </div>
                    <TargetIcon className="absolute top-10 right-10 w-24 md:w-64 h-24 md:h-64 text-slate-900/5 dark:text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                 </motion.section>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                    <StudyStreak streak={streak} completedToday={completedToday} totalCompleted={completed.size} isDarkMode={isDarkMode} />
                    <DailyChallenge onStart={() => setActiveOverlay('exam')} isDarkMode={isDarkMode} />
                  </div>

                  <motion.section 
                    whileHover={{ scale: 1.005 }}
                    className="bg-white dark:bg-stealth-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 border border-slate-200 dark:border-registry-teal/10 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-registry-teal/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/5 via-transparent to-transparent" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center space-x-6">
                        <div className={`w-20 h-20 md:w-32 md:h-32 rounded-[2rem] bg-white dark:bg-stealth-800 flex items-center justify-center border-4 border-slate-50 dark:border-stealth-700 shadow-xl ${currentRank.color}`}>
                          <currentRank.icon className="w-10 h-10 md:w-16 md:h-16" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Current Standing</span>
                          <h3 className={`text-3xl md:text-6xl font-black uppercase italic tracking-tighter ${currentRank.color}`}>
                            {currentRank.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-2">
                             <div className="px-2 py-0.5 bg-registry-teal/10 border border-registry-teal/20 rounded text-[8px] font-black text-registry-teal uppercase">Level {Math.floor(progressPercent / 10) + 1}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Math.round(progressPercent)}% to Mastery</div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block w-px h-24 bg-slate-100 dark:bg-stealth-800" />
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Registry Readiness</p>
                        <div className="text-4xl md:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                          {Math.round(progressPercent)}<span className="text-registry-teal">%</span>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-12">
                    <StudyAnalytics 
                      moduleBreakdown={moduleProgress} 
                      activityHistory={profile?.activityHistory}
                      isDarkMode={isDarkMode} 
                    />
                    <section className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <div className="flex items-center space-x-3">
                             <div className="p-2.5 bg-registry-teal/10 dark:bg-registry-teal/20 rounded-xl"><ScrollText className="w-5 h-5 md:w-6 md:h-6 text-registry-teal" /></div>
                             <h4 className="text-lg md:text-2xl font-black uppercase italic tracking-tight">Script Vault</h4>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-stealth-800 px-3 py-1 rounded-full">{(profile?.scriptVault || []).length} Nodes</span>
                       </div>
                       <div className="grid gap-4">
                          {(!profile || !profile.scriptVault || profile.scriptVault.length === 0) ? (
                            <div className="p-12 md:p-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] opacity-40 flex flex-col items-center">
                               <div className="scale-75 mb-4">
                                 <CompanionAvatar state="idle" skin="stealth" />
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-widest">Harvey's notes appear here</p>
                            </div>
                          ) : (
                            profile.scriptVault.map((s: any) => (
                              <div key={s.id} className="bg-white dark:bg-stealth-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 hover:border-registry-teal/30 transition-all group">
                                 <h5 className="font-black uppercase text-[10px] md:text-xs text-registry-teal mb-3 tracking-widest">{s.title}</h5>
                                 <p className="text-xs md:text-base font-medium opacity-80 leading-relaxed italic border-l-2 border-registry-teal/20 pl-4">"{s.content}"</p>
                              </div>
                            ))
                          )}
                       </div>
                    </section>

                    <section className="space-y-6">
                       <div className="flex items-center space-x-3 px-2">
                          <div className="p-2.5 bg-registry-teal/10 dark:bg-registry-teal/20 rounded-xl"><ClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-registry-teal" /></div>
                          <h4 className="text-lg md:text-2xl font-black uppercase italic tracking-tight">System Health</h4>
                       </div>
                       <div 
                         onClick={() => setActiveOverlay('sidebar')}
                         className="bg-white dark:bg-stealth-900 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center space-y-8 shadow-sm cursor-pointer hover:border-registry-teal/30 transition-all group"
                       >
                          <div className="relative w-48 h-48 md:w-64 md:h-64 group-hover:scale-105 transition-transform duration-500">
                             <svg className="w-full h-full -rotate-90">
                               <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-50 dark:text-stealth-950" />
                               <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="currentColor" strokeWidth="14" strokeDasharray="300" strokeDashoffset={300 * (1 - progressPercent / 100)} className="text-registry-teal transition-all duration-1000 shadow-[0_0_20px_rgba(0,210,255,0.3)]" />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none group-hover:text-registry-teal transition-colors">{Math.round(progressPercent)}%</span>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Retention</span>
                             </div>
                          </div>
                          <div className="text-center space-y-4">
                             <div className="space-y-1">
                                <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400 px-6">Ready for next node scan?</p>
                                <button onClick={(e) => { e.stopPropagation(); handleLessonSelect(0,0); }} className="text-[10px] font-black uppercase text-registry-teal underline underline-offset-4 hover:text-registry-teal/80">Resume study pulse</button>
                             </div>
                             <div className="pt-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveOverlay('exam'); }}
                                  className="px-8 py-3 bg-registry-rose hover:bg-registry-rose/80 text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest shadow-lg shadow-registry-rose/20 transition-all flex items-center space-x-2 mx-auto"
                                >
                                  <Trophy className="w-3.5 h-3.5" />
                                  <span>Initialize Mock Exam</span>
                                </button>
                             </div>
                          </div>
                       </div>
                    </section>
                 </div>
              </div>
            )}
          </div>
          <NeuralLoad data={neuralLoadData} isDarkMode={isDarkMode} />
          <Achievements progress={progressPercent} isDarkMode={isDarkMode} />
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

        {/* Mobile Navigation Bar */}
        <nav className={`fixed bottom-0 left-0 right-0 z-[400] lg:hidden backdrop-blur-3xl border-t px-2 py-3 flex justify-around items-center transition-all duration-300 ${isDarkMode ? 'bg-stealth-950 border-stealth-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]'}`}>
          <button onClick={() => {setCurrent(null); setActiveOverlay(null);}} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${!current && !activeOverlay ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase mt-1">Dash</span>
          </button>
          <button onClick={() => {setActiveOverlay(null); if(!current) setCurrent([0,0]);}} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${current && !activeOverlay ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <GraduationCap className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase mt-1">Lessons</span>
          </button>
          <button onClick={() => setActiveOverlay('exam')} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeOverlay === 'exam' ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <Trophy className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase mt-1">Exam</span>
          </button>
          <button onClick={() => setActiveOverlay('radio')} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeOverlay === 'radio' ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <Music className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase mt-1">Radio</span>
          </button>
          <button onClick={() => setActiveOverlay('tutor')} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeOverlay === 'tutor' ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <div className="scale-50 -my-2"><CompanionAvatar state="idle" isDarkMode={isDarkMode} /></div>
            <span className="text-[8px] font-black uppercase mt-1">Harvey</span>
          </button>
          <button onClick={() => setActiveOverlay('sidebar')} className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeOverlay === 'sidebar' ? 'text-registry-teal' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            <Menu className="w-6 h-6" />
            <span className="text-[8px] font-black uppercase mt-1">Menu</span>
          </button>
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
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[120] w-full md:w-[320px]"
            >
              <div className="h-full bg-white dark:bg-stealth-900 shadow-2xl flex flex-col border-r tech-border">
                 <header className="p-6 border-b tech-border flex justify-between items-center bg-white dark:bg-stealth-900 text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 scanline opacity-10" />
                    <div className="flex items-center space-x-3 relative z-10">
                       <div className="p-2 bg-registry-teal/10 rounded-lg">
                         <Activity className="w-5 h-5 text-registry-teal" />
                       </div>
                       <div>
                         <h4 className="font-black italic uppercase text-sm tracking-tighter">Registry Nodes</h4>
                         <p className="text-[8px] font-mono text-registry-teal">SYSTEM SCAN ACTIVE</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-2 relative z-10">
                        <button 
                          onClick={() => setActiveOverlay('exam')}
                          className="p-2 bg-registry-rose/10 hover:bg-registry-rose/20 text-registry-rose rounded-xl transition-all"
                          title="Initialize Mock Exam"
                        >
                          <Trophy className="w-5 h-5" />
                        </button>
                        <button onClick={() => setActiveOverlay(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl"><X className="w-6 h-6" /></button>
                     </div>
                 </header>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6 neural-grid">
                    {modules.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-2">
                        <div className={`flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br ${m.color} text-white shadow-sm border border-white/10`}>
                           <m.icon className="w-4 h-4" /><h3 className="font-black text-[10px] uppercase truncate tracking-widest">{m.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {m.lessons.map((l, lIdx) => (
                            <button key={lIdx} onClick={() => handleLessonSelect(mIdx, lIdx)} 
                              className={`w-full text-left p-3.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-between group ${current?.[0] === mIdx && current?.[1] === lIdx ? 'bg-registry-teal/10 text-registry-teal border border-registry-teal/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}>
                              <span className="truncate tracking-tighter">{l.title}</span>
                              {completed.has(l.id) ? (
                                <CheckCircle className="w-4 h-4 text-registry-teal" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-stealth-800 group-hover:bg-registry-teal/50 transition-colors" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                 </div>
                 <footer className="p-6 border-t border-white/5 bg-slate-50 dark:bg-stealth-950">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Node Sync Status</span>
                      <span className="text-[10px] font-mono text-registry-teal">98.4%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-stealth-900 rounded-full overflow-hidden">
                      <div className="h-full bg-registry-teal animate-pulse" style={{ width: '98.4%' }} />
                    </div>
                 </footer>
              </div>
            </motion.div>
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
                className="relative w-full lg:w-[480px] h-full shadow-2xl"
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
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
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
                  userId={userId || 'guest'} 
                  isDarkMode={isDarkMode} 
                  onClose={() => setShowAssetLibrary(false)}
                  onSelect={(asset) => {
                    setBgImage(asset.data || null);
                    setShowAssetLibrary(false);
                  }}
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
              className="fixed inset-0 z-[140] flex items-center justify-center p-0 md:p-12"
            >
              <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setActiveOverlay(null)} />
              <div className="relative w-full max-w-5xl h-full max-h-[900px] rounded-[3rem] overflow-hidden shadow-2xl">
                <ExamEngine 
                  profile={profile}
                  isDarkMode={isDarkMode}
                  onComplete={(results) => {
                    console.log("Exam completed:", results);
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
                cachedCount={cachedLessons.size}
                totalCount={modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                onOpenAssetLibrary={() => setShowAssetLibrary(true)}
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