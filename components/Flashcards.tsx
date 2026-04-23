import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, X, Layers, Plus, 
  RotateCw, Trash2, Brain, Sparkles, 
  CheckCircle2, AlertCircle, History,
  LayoutGrid, BookOpen, ExternalLink, RefreshCcw,
  ImageIcon, Zap, Info, Filter, Database, Volume2, Pause, Loader2
} from 'lucide-react';
import { Flashcard } from '../types';
import { FullscreenToggle } from './FullscreenToggle';
import { 
  AliasingVisual, 
  ArtifactsVisual,
  ResolutionComparison,
  DopplerShiftVisual,
  DynamicRangeVisual
} from './VisualElements';

const DEFAULT_DECK: Flashcard[] = [
  // WAVES
  { front: "What is the propagation speed of sound in soft tissue?", back: "1,540 m/s (or 1.54 mm/µs)", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Formula for Wavelength (λ) in soft tissue?", back: "λ (mm) = 1.54 / Frequency (MHz)", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Frequency of Ultrasound is higher than?", back: "20,000 Hz (20 kHz)", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Period (T) and Frequency (f) are related how?", back: "Reciprocals: T = 1/f. As frequency increases, period decreases.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Is sound a mechanical or electromagnetic wave?", back: "Mechanical wave. It requires a medium to travel.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Can sound travel in a vacuum?", back: "No. It needs molecules to propagate.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What are the two regions of a longitudinal wave?", back: "Compressions (high pressure/density) and Rarefactions (low pressure/density).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "List the 7 acoustic parameters.", back: "Period, Frequency, Amplitude, Power, Intensity, Wavelength, Propagation Speed.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What determines the propagation speed of sound?", back: "The medium only (stiffness and density). It is NOT affected by frequency.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Does frequency change as sound travels through different media?", back: "No. Frequency is determined by the sound source (transducer) only.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the relationship between Stiffness and Speed?", back: "Directly proportional. As stiffness increases, speed increases.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the relationship between Density and Speed?", back: "Inversely proportional. As density increases, speed decreases.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Bulk Modulus is another term for?", back: "Stiffness.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Interference.", back: "When two waves overlap at the same location and time, combining into a single wave.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Constructive Interference occurs when?", back: "Two in-phase waves combine to form a wave with a larger amplitude.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Destructive Interference occurs when?", back: "Two out-of-phase waves combine to form a wave with a smaller amplitude.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What are the 3 acoustic variables?", back: "Pressure (Pascals), Density (kg/cm³), Distance (cm/mm).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Pressure in acoustics.", back: "Concentration of force in an area (Pascals).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Density in acoustics.", back: "Concentration of mass in a volume (kg/cm³).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Distance in acoustics.", back: "Measure of particle motion (cm, feet, miles).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  { front: "Define Infrasound.", back: "Sound waves with frequency less than 20 Hz.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Period (T).", back: "The time it takes for one complete cycle to occur (Units: µs, ms, s).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Amplitude.", back: "The maximum displacement of an acoustic variable from its equilibrium value (the 'bigness' of the wave).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the relationship between Power and Amplitude?", back: "Power is proportional to Amplitude squared (Power ∝ Amplitude²).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the relationship between Intensity and Power?", back: "Directly proportional. Intensity = Power / Area.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the propagation speed of sound in Bone?", back: "Approximately 3,500 m/s (Fastest in solids).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the propagation speed of sound in Air?", back: "Approximately 330 m/s (Slowest in gases).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What is the propagation speed of sound in Water?", back: "Approximately 1,480 m/s.", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Define Wavelength (λ).", back: "The distance or length of one complete cycle (Units: mm, cm).", moduleId: "Waves and Sound", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // TRANSDUCERS
  { front: "What is the Curie Point?", back: "The temperature at which PZT crystal becomes depolarized and loses its piezoelectric properties (~360°C).", moduleId: "Transducers", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Purpose of the Damping Layer?", back: "Shortens the pulse length (SPL) to improve axial resolution.", moduleId: "Transducers", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Matching layer thickness is?", back: "1/4 wavelength thick.", moduleId: "Transducers", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Near Zone Length (NZL) formula?", back: "NZL = (Diameter² × Frequency) / 6", moduleId: "Transducers", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify the array type: Produces a pie-shaped image with a blunted top.", back: "Curvilinear (Convex) Array", moduleId: "Transducers", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify the array type: Produces a rectangular image format.", back: "Linear Sequential Array", moduleId: "Transducers", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Carotid_ultrasound.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // PULSED WAVE
  { front: "The 13 Microsecond Rule?", back: "For every 13µs of go-return time, the object is 1cm deep in soft tissue.", moduleId: "Pulsed Wave", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "PRP is ___________ proportional to Max Depth?", back: "Directly proportional.", moduleId: "Pulsed Wave", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Duty Factor formula?", back: "DF = (Pulse Duration / PRP) × 100", moduleId: "Pulsed Wave", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // ARTIFACTS
  { front: "Identify this artifact: Black area behind a highly attenuating structure like a gallstone.", back: "Posterior Acoustic Shadowing", moduleId: "Imaging Artifacts", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Acoustic Enhancement occurs behind?", back: "A low-attenuating structure like a fluid-filled cyst.", moduleId: "Imaging Artifacts", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ultrasound_of_a_normal_kidney.jpg/800px-Ultrasound_of_a_normal_kidney.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify this artifact: A second copy of a true reflector appearing deeper than the original, often seen near the diaphragm.", back: "Mirror Image Artifact", moduleId: "Imaging Artifacts", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ultrasound_mirror_image_artifact.jpg/800px-Ultrasound_mirror_image_artifact.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify this artifact: A form of reverberation with closely spaced echoes, often seen with metal or cholesterol crystals.", back: "Comet Tail Artifact", moduleId: "Imaging Artifacts", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Comet_tail_artifact_on_ultrasound.jpg/800px-Comet_tail_artifact_on_ultrasound.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify this artifact: Equally spaced reflections appearing like a ladder or Venetian blinds.", back: "Reverberation Artifact", moduleId: "Imaging Artifacts", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Doppler_ultrasound_of_systolic_velocity_%28Vs%29%2C_diastolic_velocity_%28Vd%29%2C_acceleration_time_%28AoAT%29%2C_systolic_acceleration_%28Ao_Accel%29_and_resistive_index_%28RI%29_of_normal_kidney.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // DOPPLER
  { front: "The Nyquist Limit formula?", back: "Nyquist Limit (Hz) = PRF / 2", moduleId: "Doppler Effect", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Cos(0°) is equal to?", back: "1.0 (Highest shift detected).", moduleId: "Doppler Effect", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Identify this phenomenon: The top of the Doppler spectrum appears at the bottom of the display.", back: "Aliasing", moduleId: "Doppler Effect", isPictureCard: true, frontImage: "https://upload.wikimedia.org/wikipedia/commons/c/cc/ColourDopplerA.jpg", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // BIOEFFECTS
  { front: "ALARA stands for?", back: "As Low As Reasonably Achievable.", moduleId: "Bioeffects & Safety", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "What predicts tissue heating?", back: "Thermal Index (TI).", moduleId: "Bioeffects & Safety", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Mechanical Index (MI) formula?", back: "MI = Peak Rarefaction Pressure / √Frequency", moduleId: "Bioeffects & Safety", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // HEMODYNAMICS
  { front: "Poiseuille's law: if radius halves, resistance increases?", back: "16 times (2 to the 4th power).", moduleId: "Hemodynamics", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Pressure is lowest where velocity is?", back: "Highest (Bernoulli's Principle).", moduleId: "Hemodynamics", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Reynolds Number predicts?", back: "Turbulent flow (> 2,000).", moduleId: "Hemodynamics", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // INSTRUMENTATION
  { front: "What receiver function corrects for attenuation?", back: "Compensation (TGC).", moduleId: "Instrumentation", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "B-mode stands for?", back: "Brightness Mode.", moduleId: "Instrumentation", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Dynamic Range is the ratio of?", back: "The largest to the smallest signal power that a system can process (measured in dB).", moduleId: "Instrumentation", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  
  // SIMULATION CARDS
  { 
    front: "Observe the simulation. Why do the peaks wrap around to the bottom?", 
    back: "Aliasing occurs when the Doppler shift exceeds the Nyquist Limit (PRF/2).", 
    moduleId: "Doppler Effect", 
    isPictureCard: true, 
    frontVisual: <AliasingVisual />, 
    repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() 
  },
  { 
    front: "Compare the resolution types. Which one is improved by higher frequency and shorter pulses?", 
    back: "Axial Resolution (parallel to beam). Lateral resolution depends on beam width.", 
    moduleId: "Transducers", 
    isPictureCard: true, 
    frontVisual: <ResolutionComparison />, 
    repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() 
  },
  { 
    front: "Identify the artifacts in this simulation. Which one creates multiple equally spaced reflections?", 
    back: "Reverberation. Mirror image is a deeper duplicate across a strong reflector.", 
    moduleId: "Imaging Artifacts", 
    isPictureCard: true, 
    frontVisual: <ArtifactsVisual />, 
    repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() 
  },
  // CLINICAL PEARLS
  { front: "Clinical Tip: How to stabilize the probe?", back: "Rest your scanning hand on the patient's body or a bolster to reduce muscle fatigue and stabilize the image.", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Clinical Tip: What to check first if the image is too dark?", back: "Increase Receiver Gain before increasing Output Power (ALARA principle).", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Clinical Tip: Best way to eliminate air pockets?", back: "Use a generous amount of ultrasound gel. Air is the enemy of ultrasound propagation.", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Clinical Tip: Where should the focal zone be placed?", back: "At or slightly below the area of interest for optimal lateral resolution.", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Clinical Tip: How to improve visualization of the pancreas?", back: "Have the patient drink a glass of water to create an acoustic window through the stomach.", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
  { front: "Clinical Tip: Mnemonic for Receiver Functions?", back: "Alphabetical Order: Amplification, Compensation, Compression, Demodulation, Reject.", moduleId: "Clinical Pearls", repetition: 0, interval: 0, easeFactor: 2.5, nextReview: Date.now() },
];

interface FlashcardsProps {
  onClose: () => void;
  modules: any[];
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode?: boolean;
  initialModule?: string | null;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ 
  onClose, 
  modules, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode,
  initialModule = null
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('spi_flashcards');
    return saved ? JSON.parse(saved) : DEFAULT_DECK;
  });

  useEffect(() => {
    localStorage.setItem('spi_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const [view, setView] = useState<'study' | 'manage' | 'selector'>(initialModule ? 'study' : 'selector');
  const [selectedModule, setSelectedModule] = useState<string | null>(initialModule);
  const [filterPicturesOnly, setFilterPicturesOnly] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newModule, setNewModule] = useState(modules[0].title);
  
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSeed = () => {
    setFlashcards(DEFAULT_DECK);
    setShowResetConfirm(false);
  };

  const filteredCards = useMemo(() => {
    let cards = selectedModule 
      ? flashcards.filter(c => c.moduleId === selectedModule) 
      : flashcards;
    
    if (filterPicturesOnly) {
      cards = cards.filter(c => c.isPictureCard);
    }
    
    if (view === 'study') {
      return cards.filter(c => c.nextReview <= Date.now() + 1000 * 60 * 5)
        .sort((a, b) => a.nextReview - b.nextReview);
    }
    return cards;
  }, [flashcards, selectedModule, view, filterPicturesOnly]);

  const currentCard = filteredCards[currentIndex];

  const handleReview = (quality: number) => {
    if (!currentCard) return;
    setIsFlipped(false);

    // SM-2 Algorithm mapping (4-button UI to 0-5 SM-2 scale)
    // 1: Again (Incorrect) -> SM-2: 1
    // 2: Hard (Correct with difficulty) -> SM-2: 3
    // 3: Good (Correct) -> SM-2: 4
    // 4: Easy (Perfect) -> SM-2: 5
    const qMap: Record<number, number> = { 1: 1, 2: 3, 3: 4, 4: 5 };
    const q = qMap[quality];

    const updated = flashcards.map(c => {
      if (c.front === currentCard.front && c.moduleId === currentCard.moduleId) {
        let n = c.repetition;
        let ef = c.easeFactor;
        let i = c.interval;

        // SM-2 Logic
        if (q >= 3) {
          if (n === 0) {
            i = 1;
          } else if (n === 1) {
            i = 6;
          } else {
            i = Math.ceil(i * ef);
          }
          n = n + 1;
        } else {
          n = 0;
          i = 1;
        }

        // Update Ease Factor
        ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (ef < 1.3) ef = 1.3;

        const dayInMs = 24 * 60 * 60 * 1000;
        return { 
          ...c, 
          repetition: n, 
          interval: i, 
          easeFactor: ef, 
          nextReview: Date.now() + (i * dayInMs) 
        };
      }
      return c;
    });

    setFlashcards(updated);

    if (currentIndex < filteredCards.length - 1) {
      // Don't increment if the card is removed from the filtered list (study mode)
      // because the next card will naturally move into the current index.
      if (view !== 'study') {
        setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
      } else {
        // In study mode, the card is filtered out, so we stay at the same index
        // unless we're at the very end.
        if (filteredCards.length <= 1) {
          setTimeout(() => setView('selector'), 300);
        }
      }
    } else {
      setView('selector');
    }
  };

  const handleAdd = () => {
    if (isBulkMode) {
      if (!bulkInput.trim()) return;
      const lines = bulkInput.split('\n');
      const newCards: Flashcard[] = lines.filter(line => line.trim().length > 0)
        .map(line => {
          const separatorMatch = line.match(/\t| - | – | — /);
          if (separatorMatch) {
            const parts = line.split(separatorMatch[0]);
            return {
              front: parts[0]?.trim() || '',
              back: parts[1]?.trim() || '',
              moduleId: newModule,
              repetition: 0,
              interval: 0,
              easeFactor: 2.5,
              nextReview: Date.now()
            };
          } else {
             // Fallback if no specific splitter
             return null;
          }
        }).filter(Boolean) as Flashcard[];

      if (newCards.length > 0) {
        setFlashcards(prev => [...prev, ...newCards]);
        setBulkInput('');
      } else {
        alert("Could not parse cards. Use format: 'Question - Answer' per line.");
      }
    } else {
      if (!newFront || !newBack) return;
      const newCard: Flashcard = {
        front: newFront,
        back: newBack,
        moduleId: newModule,
        frontImage: newImage || undefined,
        isPictureCard: !!newImage,
        repetition: 0,
        interval: 0,
        easeFactor: 2.5,
        nextReview: Date.now()
      };
      setFlashcards(prev => [...prev, newCard]);
      setNewFront('');
      setNewBack('');
      setNewImage('');
    }
  };

  const handleDelete = (front: string, mid: string) => {
    setFlashcards(prev => prev.filter(c => !(c.front === front && c.moduleId === mid)));
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950' : 'bg-white'} transition-colors duration-500 overflow-hidden relative z-[150]`}>
      {/* Background Elements */}
      <div className={`absolute inset-0 neural-grid opacity-10 pointer-events-none ${isDarkMode ? 'invert-0' : 'invert'}`} />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

      <header className={`p-4 md:p-6 ${isDarkMode ? 'bg-stealth-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} flex justify-between items-center shrink-0 border-b transition-colors duration-300 relative z-10`}>
        <div className="flex items-center space-x-2 md:space-x-3">
          <button 
            onClick={onClose} 
            className={`p-2 -ml-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal rounded-xl ${isDarkMode ? 'text-white/50 hover:text-registry-teal' : 'text-slate-400 hover:text-registry-teal'}`} 
            aria-label="Close Knowledge Matrix"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-registry-teal rounded-xl flex items-center justify-center shadow-lg shadow-registry-teal/20">
            <Layers className="w-5 h-5 text-stealth-950" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base md:text-lg font-black tracking-tight italic uppercase leading-none truncate">Knowledge Matrix</h4>
            <p className="text-[8px] md:text-[10px] text-registry-teal font-black uppercase tracking-widest mt-0.5 truncate">Neural Link: ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${isNarrating ? 'bg-registry-rose animate-pulse' : isDarkMode ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-600'}`}
              aria-label={isNarrating ? "Stop narration" : "Listen to flashcard content"}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <div className="flex space-x-1.5 md:space-x-2 shrink-0">
          <button 
            onClick={() => setFilterPicturesOnly(!filterPicturesOnly)}
            className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${filterPicturesOnly ? 'bg-registry-teal text-stealth-950 shadow-lg shadow-registry-teal/20' : isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            aria-label={filterPicturesOnly ? "Show all cards" : "Filter to picture cards only"}
            aria-pressed={filterPicturesOnly}
          >
            <ImageIcon className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </button>
          <FullscreenToggle className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} border-none`} iconClassName="w-4.5 h-4.5 md:w-5 md:h-5" />
          {view !== 'selector' && (
             <button 
              onClick={() => setView('selector')} 
              className={`p-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              aria-label="Return to module selector"
            >
                <LayoutGrid className="w-4.5 h-4.5 md:w-5 md:h-5" />
             </button>
          )}
          <button 
            onClick={() => setView('manage')} 
            className="p-2 bg-registry-teal hover:bg-teal-400 rounded-xl transition-all text-stealth-950 shadow-lg shadow-registry-teal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Add new flashcard"
          >
             <Plus className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </header>

      <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-stealth-950/50' : 'bg-slate-50/50'} p-4 md:p-6 scroll-smooth pb-24 md:pb-6 relative z-10`}>
        {view === 'selector' && (
          <div className="max-w-xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className={`col-span-2 p-6 md:p-8 rounded-[2rem] overflow-hidden relative shadow-2xl border group transition-colors duration-500 ${isDarkMode ? 'bg-stealth-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                 <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                 <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                 <div className="relative z-10">
                   <div className="flex items-center space-x-3 mb-2">
                      <Zap className="w-5 h-5 text-registry-teal glow-teal" />
                      <h3 className="text-xl md:text-2xl font-black italic uppercase">DAILY SYNC</h3>
                   </div>
                   <p className="text-xs md:text-sm opacity-60 mb-6 max-w-[90%] md:max-w-[80%] leading-relaxed">Boost your active recall with <span className="text-registry-teal">{flashcards?.length || 0}</span> physics nodes.</p>
                   <div className="flex space-x-2 md:space-x-3">
                     <button 
                       disabled={flashcards.filter(c => c.nextReview <= Date.now()).length === 0}
                       onClick={() => { setView('study'); setSelectedModule(null); setCurrentIndex(0); }}
                       className="px-6 py-3.5 md:px-8 md:py-4 bg-registry-cobalt hover:bg-blue-400 text-white disabled:opacity-30 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center space-x-2 transition-all shadow-lg active:scale-95"
                     >
                       <RefreshCcw className="w-3.5 h-3.5" />
                       <span>Review Due ({flashcards.filter(c => c.nextReview <= Date.now()).length})</span>
                     </button>
                     <button 
                        onClick={() => setShowResetConfirm(true)}
                        className={`p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        title="Reset deck to default"
                     >
                        <Database className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
                 <Layers className={`absolute -bottom-6 -right-6 w-32 md:w-48 h-32 md:h-48 rotate-12 group-hover:rotate-6 transition-transform duration-1000 ${isDarkMode ? 'text-white/5' : 'text-slate-200/50'}`} />
              </div>
              
              {modules.map((m, idx) => {
                const count = flashcards.filter(c => c.moduleId === m.title).length || 0;
                const dueCount = flashcards.filter(c => c.moduleId === m.title && c.nextReview <= Date.now()).length || 0;
                return (
                  <button key={idx} onClick={() => { setSelectedModule(m.title); setView('study'); setCurrentIndex(0); }} 
                    className={`p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] border hover:border-registry-teal/50 transition-all text-left shadow-sm group relative overflow-hidden active:scale-95 ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="absolute inset-0 scanline opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <m.icon className="w-4.5 h-4.5 md:w-5 md:h-5" />
                    </div>
                    <h5 className={`font-black uppercase text-[9px] md:text-[10px] tracking-tight mb-1 truncate pr-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.title}</h5>
                    <div className="flex justify-between items-center">
                       <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">{count} Nodes</p>
                       {dueCount > 0 && (
                         <div className="flex items-center space-x-1">
                            <span className="text-[7px] font-black text-registry-rose uppercase tracking-widest">{dueCount} DUE</span>
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-registry-rose rounded-full animate-pulse shadow-[0_0_5px_#d946ef]" />
                         </div>
                       )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {view === 'study' && (
          <div className="max-w-xl mx-auto h-full flex flex-col justify-center animate-in zoom-in-95 duration-500 px-2 md:px-0">
            {currentCard ? (
              <div className="space-y-8 md:space-y-12">
                <div className="flex justify-between items-center px-2">
                   <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-registry-teal rounded-full animate-pulse shadow-[0_0_5px_#00e5ff]" />
                      <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] truncate max-w-[120px] sm:max-w-none">{selectedModule || 'Hybrid Matrix'}</span>
                   </div>
                   <span className="text-[9px] md:text-[10px] font-black uppercase text-registry-teal bg-registry-teal/10 border border-registry-teal/20 px-3 py-1 rounded-full">{currentIndex + 1} / {filteredCards.length}</span>
                </div>
                
                <div 
                  className="relative w-full h-[320px] md:h-[450px] cursor-pointer perspective-2000 group active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal rounded-[3rem]" 
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Flashcard: ${currentCard.front}. Press to flip and see answer.`}
                  aria-expanded={isFlipped}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
                >
                  <div className={`relative w-full h-full transition-all duration-700 transform-style-3d shadow-2xl rounded-2xl md:rounded-[3rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
                    <div className={`absolute inset-0 backface-hidden rounded-2xl md:rounded-[3rem] p-6 md:p-10 flex flex-col items-center justify-center text-center border overflow-hidden ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'}`}>
                      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
                      
                      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex space-x-1.5 md:space-x-2 z-10">
                        <div className="p-2 bg-registry-teal/10 border border-registry-teal/20 rounded-lg">
                          <Brain className="w-4 h-4 md:w-5 md:h-5 text-registry-teal" />
                        </div>
                        {currentCard.isPictureCard && (
                          <div className="p-2 bg-registry-rose/10 border border-registry-rose/20 rounded-lg">
                            <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-registry-rose" />
                          </div>
                        )}
                      </div>
                      
                      {currentCard.frontImage ? (
                        <div className={`mb-4 md:mb-6 w-full h-32 md:h-56 rounded-xl md:rounded-2xl overflow-hidden border relative z-10 ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                          <img 
                            src={currentCard.frontImage} 
                            alt="Diagram" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : null}

                      {currentCard.frontVisual && (
                        <div className={`mb-4 md:mb-6 w-full h-32 md:h-56 rounded-xl md:rounded-2xl overflow-hidden border flex items-center justify-center p-4 relative z-10 ${isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                          <div className="w-full h-full scale-75 origin-center">
                            {currentCard.frontVisual}
                          </div>
                        </div>
                      )}

                      <h3 className={`text-lg md:text-3xl font-black leading-tight italic relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentCard.front}</h3>
                      
                      <div className="absolute bottom-6 md:bottom-8 flex items-center space-x-2 text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-registry-teal transition-all z-10">
                        <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Tap to flip node</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-registry-teal rounded-2xl md:rounded-[3rem] p-6 md:p-10 flex flex-col items-center justify-center text-center text-stealth-950 overflow-hidden">
                      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-stealth-950/10 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-pulse relative z-10">
                         <Zap className="w-6 h-6 md:w-8 md:h-8 text-stealth-950" />
                      </div>
                      <h3 className="text-lg md:text-3xl font-black italic leading-relaxed relative z-10 uppercase tracking-tight">{currentCard.back}</h3>
                    </div>
                  </div>
                </div>

                <div className={`grid grid-cols-4 gap-1.5 md:gap-4 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 md:translate-y-8 scale-95 pointer-events-none'}`}>
                   {[
                     { label: 'Again', quality: 1, color: 'bg-registry-rose' },
                     { label: 'Hard', quality: 2, color: 'bg-amber-500' },
                     { label: 'Good', quality: 3, color: 'bg-registry-teal' },
                     { label: 'Easy', quality: 4, color: 'bg-registry-teal' }
                   ].map(b => (
                     <button 
                       key={b.quality} 
                       onClick={(e) => { e.stopPropagation(); handleReview(b.quality); }}
                       className={`${b.color} text-stealth-950 py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-lg active:scale-90 transition-all relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                       aria-label={`Mark as ${b.label}`}
                     >
                       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                       <span className="relative z-10">{b.label}</span>
                     </button>
                   ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-500">
                 <div className="flex items-center justify-center space-x-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-registry-teal/10 border border-registry-teal/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-registry-teal glow-teal" />
                    </div>
                    <div className={`p-3 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'}`}>
                       <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                    </div>
                 </div>
                 <div className="space-y-1.5 md:space-y-2">
                    <h3 className={`text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Node Synced</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">Your knowledge retention is at peak state</p>
                 </div>
                 <button onClick={() => setView('selector')} className="px-12 py-5 md:px-16 md:py-6 bg-registry-teal text-stealth-950 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-2xl hover:scale-105 transition-transform active:scale-95">Return to Console</button>
              </div>
            )}
          </div>
        )}

        {view === 'manage' && (
          <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-32 animate-in fade-in duration-500">
             <div className={`p-6 md:p-12 rounded-2xl md:rounded-[3.5rem] shadow-2xl border space-y-6 md:space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8 justify-between">
                     <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-registry-teal rounded-xl md:rounded-2xl flex items-center justify-center text-stealth-950 shadow-lg shadow-registry-teal/20">
                          <Plus className="w-5 h-5 md:w-6 md:h-6" />
                       </div>
                       <h4 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>New Knowledge Node</h4>
                     </div>
                     <button
                       onClick={() => setIsBulkMode(!isBulkMode)}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isBulkMode ? 'bg-registry-teal text-stealth-950' : isDarkMode ? 'bg-stealth-950 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                     >
                       {isBulkMode ? 'Single Mode' : 'Bulk Import'}
                     </button>
                  </div>
                  
                  <div className="grid gap-5 md:gap-6">
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block px-1">Target Module</label>
                        <select value={newModule} onChange={e => setNewModule(e.target.value)} className={`w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs outline-none border transition-all cursor-pointer ${isDarkMode ? 'bg-stealth-950 text-white border-white/10 focus:border-registry-teal' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-registry-teal'}`}>
                          {modules.map(m => <option key={m.title} value={m.title}>{m.title}</option>)}
                        </select>
                      </div>
                      {!isBulkMode && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block px-1">Visual Reference (Optional)</label>
                          <input type="text" value={newImage} onChange={e => setNewImage(e.target.value)} placeholder="URL of diagram" className={`w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs outline-none border transition-all ${isDarkMode ? 'bg-stealth-950 text-white border-white/10 focus:border-registry-teal' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-registry-teal'}`} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {isBulkMode ? (
                        <div className="space-y-1.5">
                          <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block px-1">Paste Bulk Data</label>
                          <textarea 
                            value={bulkInput} 
                            onChange={e => setBulkInput(e.target.value)} 
                            className={`w-full p-4 md:p-6 rounded-xl md:rounded-[2rem] border outline-none text-[11px] md:text-sm font-bold h-48 transition-all resize-none ${isDarkMode ? 'bg-stealth-950 text-white border-white/10 focus:border-registry-teal' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-registry-teal'}`} 
                            placeholder="Question 1 - Answer 1&#10;Question 2 - Answer 2" 
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block px-1">Physics Query</label>
                            <textarea value={newFront} onChange={e => setNewFront(e.target.value)} className={`w-full p-4 md:p-6 rounded-xl md:rounded-[2rem] border outline-none text-[11px] md:text-sm font-bold h-24 md:h-28 transition-all resize-none ${isDarkMode ? 'bg-stealth-950 text-white border-white/10 focus:border-registry-teal' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-registry-teal'}`} placeholder="e.g. Formula for Mechanical Index?" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block px-1">Physical Principle Response</label>
                            <textarea value={newBack} onChange={e => setNewBack(e.target.value)} className={`w-full p-4 md:p-6 rounded-xl md:rounded-[2rem] border outline-none text-[11px] md:text-sm font-bold h-24 md:h-28 transition-all resize-none ${isDarkMode ? 'bg-stealth-950 text-white border-white/10 focus:border-registry-teal' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-registry-teal'}`} placeholder="e.g. MI = Peak Rarefaction Pressure / sqrt(Frequency)" />
                          </div>
                        </>
                      )}
                    </div>

                    <button onClick={handleAdd} className="w-full py-4.5 md:py-6 bg-registry-teal hover:bg-teal-400 text-stealth-950 rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-sm shadow-lg shadow-registry-teal/20 active:scale-95 transition-all flex items-center justify-center space-x-2.5">
                       <CheckCircle2 className="w-4.5 h-4.5 md:w-5 md:h-5" />
                       <span>{isBulkMode ? 'Inject Multiple Nodes' : 'Inject node into Matrix'}</span>
                    </button>
                  </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">Knowledge Library ({flashcards?.length || 0})</h4>
                </div>
                <div className="grid gap-3">
                  {flashcards.map((c, i) => (
                    <div key={i} className={`p-4 md:p-6 rounded-2xl border flex justify-between items-center group shadow-sm transition-all hover:border-registry-teal/30 relative overflow-hidden ${isDarkMode ? 'bg-stealth-900 border-white/5' : 'bg-white border-slate-200'}`}>
                      <div className="absolute inset-0 scanline opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                      <div className="flex items-center space-x-3 md:space-x-4 max-w-[85%] relative z-10">
                        {c.frontImage ? (
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 border ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                            <img 
                            src={c.frontImage} 
                            alt="Ref" 
                            className="w-full h-full object-cover opacity-80" 
                            referrerPolicy="no-referrer"
                          />
                          </div>
                        ) : null}
                        <div className="space-y-0.5 md:space-y-1 overflow-hidden">
                          <div className="flex items-center space-x-2">
                             <span className={`px-2 py-0.5 border rounded-md text-[7px] md:text-[8px] font-black uppercase text-slate-500 block w-fit ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-slate-50 border-slate-200'}`}>{c.moduleId}</span>
                             <span className="text-[7px] font-black text-registry-teal uppercase tracking-widest">
                                Next: {new Date(c.nextReview).toLocaleDateString()} ({c.interval}d)
                             </span>
                          </div>
                          <p className={`font-bold text-[11px] md:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{c.front}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(c.front, c.moduleId)} className="p-2 text-slate-600 hover:text-registry-rose transition-colors relative z-10">
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stealth-950/80 backdrop-blur-md" onClick={() => setShowResetConfirm(false)} />
          <div className={`relative w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="w-16 h-16 bg-registry-rose/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-registry-rose" />
            </div>
            <h3 className="text-xl font-black uppercase italic text-center mb-2">Reset Node Matrix?</h3>
            <p className="text-xs text-center opacity-60 mb-8 leading-relaxed">This will restore the default physics nodes and clear all custom entries. This action is irreversible.</p>
            <div className="flex space-x-3">
              <button onClick={() => setShowResetConfirm(false)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
              <button onClick={handleSeed} className="flex-1 py-4 bg-registry-rose text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-registry-rose/20 active:scale-95 transition-all">Reset All</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
