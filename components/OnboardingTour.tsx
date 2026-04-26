
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Volume2, Pause, Loader2, Sparkles, Brain, Book, LayoutGrid, Target, ShieldCheck } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  narration: string;
  icon: React.ReactNode;
  target?: string; // CSS selector for highlighting
}

interface OnboardingTourProps {
  onClose: () => void;
  onPlayNarration: (text: string, id: string) => void;
  isNarrating: boolean;
  isTtsLoading: boolean;
  isDarkMode: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Welcome to SPI Master",
    description: "Your neural link to mastering ultrasound physics. This platform is designed to turn complex principles into clinical intuition.",
    narration: "Welcome to the Ultrasound Physics and Instrumentation Master Registry. This platform is your neural link to mastering the physics of sound. We've combined high-fidelity simulations, AI-driven tutoring, and a comprehensive curriculum to ensure you don't just pass the exam, but master the craft.",
    icon: <Sparkles className="w-8 h-8 text-registry-teal" />
  },
  {
    title: "The Curriculum Nodes",
    description: "15 high-yield modules weighted by the ARDMS content outline. Track your progress as you synchronize with the registry.",
    narration: "The curriculum is divided into 15 high-yield modules, covering everything from Wave Parameters to Advanced Modalities. Each module is weighted according to the ARDMS content outline, helping you prioritize your study time effectively.",
    icon: <LayoutGrid className="w-8 h-8 text-registry-cobalt" />
  },
  {
    title: "Neural AI Tools",
    description: "Access the AI Tutor for real-time guidance, the Lexicon for deep-dives, and the Asset Library for custom media.",
    narration: "Your toolkit includes the AI Tutor for real-time guidance, the Physics Lexicon for deep-dives into terminology, and the Asset Library for customizing your learning experience with real clinical media.",
    icon: <Brain className="w-8 h-8 text-registry-teal" />
  },
  {
    title: "Custom Case Studies",
    description: "Link your own images and videos to any lesson or lexicon term to build a personalized clinical database.",
    narration: "One of our most powerful features is the ability to customize your learning. Use the Asset Library to link your own clinical images and videos to any lesson or lexicon term, creating a personalized study experience that reflects your real-world practice.",
    icon: <Book className="w-8 h-8 text-registry-amber" />
  },
  {
    title: "Registry Simulation",
    description: "When you're ready, enter the Exam Engine to test your knowledge against the full SPI content outline.",
    narration: "When you're ready to prove your mastery, enter the Exam Engine. It simulates the full SPI registry experience, providing detailed feedback on your strengths and areas for improvement across all physics domains.",
    icon: <Target className="w-8 h-8 text-registry-rose" />
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ 
  onClose, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];

  useEffect(() => {
    // Auto-play narration for the first step
    onPlayNarration(step.narration, `onboarding_${currentStep}`);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-stealth-950/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full max-w-lg overflow-hidden rounded-[3rem] border shadow-2xl flex flex-col ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 flex">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-full transition-all duration-500 ${idx <= currentStep ? 'bg-registry-teal' : 'bg-transparent'}`}
              style={{ width: `${100 / ONBOARDING_STEPS.length}%` }}
            />
          ))}
        </div>

        <div className="p-8 pt-12">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              {step.icon}
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-white/40' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-tight">
                {step.title}
              </h2>
              <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 p-4 rounded-2xl bg-registry-teal/5 border border-registry-teal/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-registry-teal rounded-full animate-pulse" />
              <span className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Neural Narration</span>
            </div>
            <button 
              onClick={() => onPlayNarration(step.narration, `onboarding_${currentStep}`)}
              disabled={isTtsLoading}
              className={`p-2 rounded-lg transition-all ${isNarrating ? 'bg-registry-rose text-white' : 'hover:bg-registry-teal/20 text-registry-teal'}`}
            >
              {isTtsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isNarrating ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className={`p-8 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/10 text-slate-500'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-registry-rose transition-all`}
            >
              Skip Tour
            </button>
            <button 
              onClick={handleNext}
              className="px-8 py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-registry-teal/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>{currentStep === ONBOARDING_STEPS.length - 1 ? "Begin Mastery" : "Next Step"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
