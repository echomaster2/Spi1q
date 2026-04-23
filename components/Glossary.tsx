import React, { useState, useMemo } from 'react';
import { Search, X, Book, Hash, ChevronLeft, Bookmark, Waves, Volume2, Pause, Loader2, Zap, Activity, Shield, Thermometer, Maximize2, MoveRight, Repeat, ArrowDownUp, Layers, Cpu, Binary, Monitor, Stethoscope, Brain, FileVideo, Trash2, Target, HeartPulse, FlaskConical, Clock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullscreenToggle } from './FullscreenToggle';
import { GlossaryTerm, UserProfile as UserProfileType } from '../types';
import { generateText } from '../src/services/aiService';
import { toast } from 'sonner';

interface GlossaryProps {
  isDarkMode: boolean;
  onClose: () => void;
  onPlayNarration?: (text: string, id: string) => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  profile?: UserProfileType;
  onUpdateProfile?: (updates: Partial<UserProfileType>) => void;
}

export const SPI_GLOSSARY: GlossaryTerm[] = [
  // BIOEFFECTS & SAFETY
  { 
    term: "ALARA", 
    definition: "As Low As Reasonably Achievable. The core principle of ultrasound safety emphasizing minimized exposure time and output power.", 
    category: "Bioeffects",
    clinicalPearl: "Always start with the lowest power setting and adjust gain first to optimize your image before increasing output power.",
    visual: (
      <div className="flex items-center space-x-1">
        <Shield className="w-4 h-4 text-registry-teal animate-pulse" />
        <div className="flex flex-col space-y-0.5">
          <motion.div animate={{ width: [4, 12, 4] }} transition={{ duration: 2, repeat: Infinity }} className="h-1 bg-registry-teal/40 rounded-full" />
          <motion.div animate={{ width: [12, 4, 12] }} transition={{ duration: 2, repeat: Infinity }} className="h-1 bg-registry-teal/20 rounded-full" />
        </div>
      </div>
    )
  },
  { 
    term: "Cavitation", 
    definition: "The interaction of sound waves with microscopic gas bubbles in tissues, divided into stable and transient (normal) types.", 
    category: "Bioeffects",
    clinicalPearl: "Transient cavitation is more likely to occur with high-intensity, short-pulse ultrasound, which is why we monitor MI closely during contrast studies.",
    visual: (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute w-6 h-6 rounded-full border-2 border-registry-teal" 
        />
        <motion.div 
          animate={{ scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-registry-teal shadow-[0_0_8px_rgba(0,245,212,0.6)]" 
        />
      </div>
    )
  },
  { 
    term: "Mechanical Index (MI)", 
    definition: "An index that estimates the likelihood of non-thermal (mechanical) bioeffects, specifically cavitation.", 
    category: "Bioeffects",
    clinicalPearl: "Keep MI < 1.9 for general scanning and < 0.4 for contrast-enhanced ultrasound to avoid microbubble destruction.",
    visual: (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-registry-teal/20 rounded-full" 
        />
        <div className="w-5 h-5 rounded-full bg-registry-teal/10 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.8, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-registry-teal rounded-full" 
          />
        </div>
      </div>
    )
  },
  { 
    term: "SPTA Intensity", 
    definition: "Spatial Peak Temporal Average. The most relevant intensity measurement with respect to tissue heating/thermal bioeffects.", 
    category: "Bioeffects",
    clinicalPearl: "SPTA is the intensity that matters for bioeffects. The FDA limit for unfocused beams is 100 mW/cm² and 1 W/cm² for focused beams.",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-rose">
        <path d="M0 15 Q 5 0, 10 15 T 20 15 T 30 15 T 40 15" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
      </svg>
    )
  },
  { 
    term: "Thermal Index (TI)", 
    definition: "A predictor of the maximum temperature increase expected under clinical conditions; includes TIS (soft tissue), TIB (bone), and TIC (cranial).", 
    category: "Bioeffects",
    clinicalPearl: "Monitor TIB (Bone) specifically when scanning fetal heads or spines, as bone absorbs more energy and heats up faster than soft tissue.",
    visual: (
      <div className="flex flex-col items-center">
        <div className="relative w-3 h-8 bg-stealth-950 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            animate={{ height: ["20%", "80%", "20%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-0 w-full bg-registry-rose"
          />
        </div>
        <Thermometer className="w-3 h-3 text-registry-rose mt-1" />
      </div>
    )
  },
  {
    term: "Dosimetry",
    definition: "The science of identifying and measuring the characteristics of an ultrasound beam that are relevant to its potential for producing biological effects.",
    category: "Bioeffects",
    clinicalPearl: "Dosimetry helps establish safety standards by quantifying the energy delivered to tissues.",
    visual: <Target className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "In Vivo",
    definition: "Research performed within the living body of a plant or animal.",
    category: "Bioeffects",
    visual: <HeartPulse className="w-4 h-4 text-registry-rose" />
  },
  {
    term: "In Vitro",
    definition: "Research performed outside the living body, in an artificial environment like a test tube.",
    category: "Bioeffects",
    visual: <FlaskConical className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Hydrophone",
    definition: "A small transducer element on the end of a narrow needle used to measure the pressure and intensity of an ultrasound beam.",
    category: "Bioeffects",
    clinicalPearl: "Hydrophones are essential for quality control and ensuring transducers meet safety specifications.",
    visual: <Activity className="w-4 h-4 text-registry-teal" />
  },

  // WAVES & PARAMETERS
  { 
    term: "Amplitude", 
    definition: "The 'bigness' of a wave; the difference between the maximum value and the average value of an acoustic variable.", 
    category: "Waves",
    clinicalPearl: "Amplitude decreases as sound travels through the body due to attenuation. Use TGC to compensate for this loss of signal at depth.",
    visual: (
      <div className="relative w-12 h-8 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
          <motion.path 
            d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            animate={{ d: ["M0 10 Q 5 8, 10 10 T 20 10 T 30 10 T 40 10", "M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10", "M0 10 Q 5 8, 10 10 T 20 10 T 30 10 T 40 10"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <Maximize2 className="absolute top-0 right-0 w-3 h-3 text-registry-teal/40" />
      </div>
    )
  },
  { 
    term: "Frequency", 
    definition: "The number of cycles per second, measured in Hertz (Hz). For diagnostic ultrasound, typically 2-15 MHz.", 
    category: "Waves",
    clinicalPearl: "Higher frequency provides better axial resolution but less penetration. Use the highest frequency that still allows you to see the target structure.",
    visual: (
      <div className="w-12 h-8 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
          <motion.path 
            d="M0 10 Q 2.5 0, 5 10 T 10 10 T 15 10 T 20 10 T 25 10 T 30 10 T 35 10 T 40 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            animate={{ x: [-5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    )
  },
  { 
    term: "Period", 
    definition: "The time it takes for one complete cycle to occur; inversely proportional to frequency.", 
    category: "Waves",
    visual: (
      <div className="relative w-12 h-8 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
          <motion.path 
            d="M5 10 Q 10 0, 15 10 T 25 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <motion.div 
          animate={{ x: [5, 25, 5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-1 w-1 h-1 bg-registry-teal rounded-full"
        />
      </div>
    )
  },
  { 
    term: "Propagation Speed", 
    definition: "The rate at which a sound wave travels through a medium. Standardized at 1,540 m/s for soft tissue.", 
    category: "Waves",
    visual: (
      <div className="flex items-center space-x-2">
        <div className="w-12 h-1.5 bg-stealth-800 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ x: [-20, 60] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-4 bg-registry-teal rounded-full shadow-[0_0_8px_rgba(0,245,212,0.5)]"
          />
        </div>
      </div>
    )
  },
  { 
    term: "Wavelength", 
    definition: "The distance or length of one complete cycle. λ = c/f.", 
    category: "Waves",
    visual: (
      <div className="relative w-12 h-8 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
          <path d="M5 10 Q 10 0, 15 10 T 25 10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <motion.div 
          animate={{ width: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-1 h-0.5 bg-registry-teal left-1/2 -translate-x-1/2"
        />
      </div>
    )
  },
  { 
    term: "Infrasound", 
    definition: "Sound waves with a frequency less than 20 Hz, below human hearing.", 
    category: "Waves",
    visual: (
      <div className="w-12 h-8 flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ x: [-20, 20] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-6 bg-slate-300 rounded-full blur-[1px]"
        />
      </div>
    )
  },
  { 
    term: "Ultrasound", 
    definition: "Sound waves with a frequency greater than 20,000 Hz (20 kHz).", 
    category: "Waves",
    visual: (
      <div className="w-12 h-8 flex items-center justify-center space-x-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i}
            animate={{ height: [4, 16, 4] }}
            transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.05 }}
            className="w-1 bg-registry-teal rounded-full"
          />
        ))}
      </div>
    )
  },
  {
    term: "Bandwidth",
    definition: "The range of frequencies contained within an ultrasound pulse. Bandwidth = Max Frequency - Min Frequency.",
    category: "Waves",
    clinicalPearl: "Short pulses (high damping) have a wide bandwidth, while long pulses (low damping) have a narrow bandwidth.",
    visual: (
      <div className="flex items-end space-x-0.5 h-6">
        {[2, 4, 8, 10, 8, 4, 2].map((h, i) => (
          <div key={i} className="w-1 bg-registry-teal" style={{ height: `${h*2}px` }} />
        ))}
      </div>
    )
  },
  {
    term: "Quality Factor (Q-Factor)",
    definition: "A unitless number inversely related to bandwidth. Q-Factor = Main Frequency / Bandwidth.",
    category: "Waves",
    clinicalPearl: "Imaging transducers are low-Q because they use damping to create short pulses with a wide bandwidth.",
    visual: <Target className="w-4 h-4 text-registry-teal" />
  },

  // PULSED WAVE PARAMETERS
  { 
    term: "Duty Factor", 
    definition: "The percentage or fraction of time that the system is actually transmitting sound. For PW, typically < 1%.", 
    category: "Pulsed Wave",
    visual: (
      <div className="flex items-end space-x-0.5 h-6">
        <motion.div 
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-full bg-registry-teal rounded-t-sm" 
        />
        <div className="w-6 h-0.5 bg-stealth-800" />
        <motion.div 
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-full bg-registry-teal rounded-t-sm" 
        />
      </div>
    )
  },
  { 
    term: "Pulse Duration", 
    definition: "The actual time from the start of a pulse to the end of that pulse; determined by the source.", 
    category: "Pulsed Wave",
    visual: (
      <div className="relative w-12 h-8 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
          <motion.path 
            d="M5 10 L 10 2 L 15 18 L 20 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        <div className="absolute bottom-0 w-4 h-0.5 bg-registry-teal/30" />
      </div>
    )
  },
  { 
    term: "PRF", 
    definition: "Pulse Repetition Frequency. The number of pulses transmitted into the body each second.", 
    category: "Pulsed Wave",
    visual: (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4].map(i => (
          <motion.div 
            key={i}
            animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-1 h-4 bg-registry-teal rounded-full" 
          />
        ))}
      </div>
    )
  },
  { 
    term: "PRP", 
    definition: "Pulse Repetition Period. The time from the start of one pulse to the start of the next; directly related to imaging depth.", 
    category: "Pulsed Wave",
    visual: (
      <div className="w-12 h-8 flex items-center relative">
        <motion.div 
          animate={{ x: [0, 40], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-2 h-4 bg-registry-teal rounded-sm"
        />
        <div className="absolute inset-0 border-b border-dashed border-white/20 translate-y-2" />
      </div>
    )
  },
  { 
    term: "Spatial Pulse Length (SPL)", 
    definition: "The distance that a pulse occupies in space. SPL = # cycles × wavelength.", 
    category: "Pulsed Wave",
    visual: (
      <div className="relative w-12 h-8 flex items-center">
        <motion.div 
          animate={{ x: [-10, 30] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg width="20" height="10" viewBox="0 0 20 10" className="text-registry-teal">
            <path d="M0 5 Q 2.5 0, 5 5 T 10 5 T 15 5 T 20 5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
        <div className="absolute bottom-0 w-full h-0.5 bg-registry-teal/20" />
      </div>
    )
  },

  // INTERACTION WITH MEDIA
  { 
    term: "Absorption", 
    definition: "The conversion of sound energy into heat; the primary component of attenuation in soft tissue.", 
    category: "Media Interaction",
    visual: (
      <div className="flex items-center space-x-2">
        <motion.div animate={{ x: [0, 10], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          <Waves className="w-4 h-4 text-slate-400" />
        </motion.div>
        <Thermometer className="w-4 h-4 text-rose-500 animate-pulse" />
      </div>
    )
  },
  { 
    term: "Attenuation", 
    definition: "The weakening of the sound beam as it travels. Includes absorption, scattering, and reflection.", 
    category: "Media Interaction",
    visual: (
      <div className="flex items-center space-x-1">
        <motion.div 
          animate={{ opacity: [1, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex space-x-0.5"
        >
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-1 h-4 bg-registry-teal rounded-full" />
          ))}
        </motion.div>
      </div>
    )
  },
  { 
    term: "Impedance (Z)", 
    definition: "The acoustic resistance to sound traveling in a medium, measured in Rayls (Z = density × speed).", 
    category: "Media Interaction",
    visual: (
      <div className="flex items-center">
        <div className="w-4 h-8 bg-stealth-800 rounded-l-md" />
        <motion.div 
          animate={{ width: [2, 6, 2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-registry-teal shadow-[0_0_10px_rgba(0,245,212,0.4)] z-10" 
        />
        <div className="w-4 h-8 bg-stealth-900 rounded-r-md" />
      </div>
    )
  },
  { 
    term: "Reflection", 
    definition: "The redirection of a portion of the sound beam back toward the transducer when hitting a boundary.", 
    category: "Media Interaction",
    visual: (
      <div className="relative w-12 h-10">
        <div className="absolute bottom-0 w-full h-1 bg-stealth-800" />
        <motion.div 
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 30, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-registry-teal rounded-full"
        />
      </div>
    )
  },
  { 
    term: "Refraction", 
    definition: "The change in direction of wave propagation when traveling from one medium to another (requires oblique incidence and different speeds).", 
    category: "Media Interaction",
    visual: (
      <div className="relative w-12 h-10">
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-stealth-800" />
        <motion.div 
          animate={{ 
            x: [-20, 0, 30], 
            y: [0, 15, 30],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-registry-teal rounded-full"
        />
      </div>
    )
  },
  { 
    term: "Rayleigh Scattering", 
    definition: "Special scattering occurring when the reflector is much smaller than the wavelength (e.g., Red Blood Cells).", 
    category: "Media Interaction",
    visual: (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="w-1 h-1 bg-rose-500 rounded-full" />
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ scale: [0, 2], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            className="absolute w-full h-full border border-rose-500/30 rounded-full"
          />
        ))}
      </div>
    )
  },
  { 
    term: "Specular Reflection", 
    definition: "Reflection from a smooth surface that is large relative to the wavelength (e.g., diaphragm).", 
    category: "Media Interaction",
    visual: (
      <div className="relative w-12 h-8">
        <div className="absolute bottom-0 w-full h-1 bg-stealth-800" />
        <motion.div 
          animate={{ 
            x: [0, 20, 40], 
            y: [0, 28, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-1.5 h-1.5 bg-registry-teal rounded-full"
        />
      </div>
    )
  },

  // TRANSDUCERS
  { 
    term: "Curie Point", 
    definition: "The temperature at which PZT becomes depolarized (~360°C). Probes must never be autoclaved.", 
    category: "Transducers",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 bg-rose-500/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        </div>
        <div className="text-[6px] font-black text-rose-500 mt-1">360°C</div>
      </div>
    )
  },
  { 
    term: "Damping Element", 
    definition: "Also called the backing material; reduces crystal ringing to shorten pulses and improve axial resolution.", 
    category: "Transducers",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-6 h-2 bg-stealth-800 rounded-t-sm" />
        <div className="w-6 h-1 bg-registry-teal" />
      </div>
    )
  },
  { 
    term: "Matching Layer", 
    definition: "The component with intermediate impedance placed in front of the PZT to increase sound transmission into the body.", 
    category: "Transducers",
    visual: (
      <div className="flex flex-col space-y-0.5">
        <div className="w-8 h-1 bg-stealth-800" />
        <div className="w-8 h-2 bg-registry-teal/60" />
        <div className="w-8 h-3 bg-registry-teal" />
      </div>
    )
  },
  { 
    term: "PZT", 
    definition: "Lead Zirconate Titanate. The synthetic ceramic material most commonly used as the piezoelectric element.", 
    category: "Transducers",
    visual: (
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="w-8 h-8 bg-registry-teal rounded-lg flex items-center justify-center shadow-inner"
      >
        <Zap className="w-4 h-4 text-white" />
      </motion.div>
    )
  },
  {
    term: "Subdicing",
    definition: "Dividing a PZT crystal into smaller pieces (sub-elements) to reduce grating lobes in array transducers.",
    category: "Transducers",
    visual: <Layers className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Dynamic Aperture",
    definition: "A technique where the system changes the number of active elements used to transmit or receive pulses to maintain a constant beam width at different depths.",
    category: "Transducers",
    visual: <Maximize2 className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Vector Array",
    definition: "A transducer that combines linear sequential and linear phased array technologies, creating a trapezoidal image format.",
    category: "Transducers",
    visual: <MoveRight className="w-4 h-4 text-registry-teal rotate-45" />
  },
  { 
    term: "Fresnel Zone", 
    definition: "The near zone; the region from the transducer face to the focal point.", 
    category: "Transducers",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
        <path d="M0 0 L 20 8 L 20 12 L 0 20 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      </svg>
    )
  },
  { 
    term: "Fraunhofer Zone", 
    definition: "The far zone; the region starting at the focal point and extending deeper where the beam diverges.", 
    category: "Transducers",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
        <path d="M0 8 L 40 0 L 40 20 L 0 12 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      </svg>
    )
  },

  // RESOLUTION
  { 
    term: "Axial Resolution", 
    definition: "The ability to distinguish two structures parallel to the beam. Determined by SPL/2. Depth-independent.", 
    category: "Resolution",
    visual: (
      <div className="flex flex-col items-center space-y-2">
        <motion.div 
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-1"
        >
          <div className="w-1.5 h-1.5 bg-registry-teal rounded-full shadow-[0_0_5px_rgba(0,245,212,0.5)]" />
          <div className="w-1.5 h-1.5 bg-registry-teal rounded-full shadow-[0_0_5px_rgba(0,245,212,0.5)]" />
        </motion.div>
        <div className="w-0.5 h-6 bg-registry-teal/20 absolute" />
      </div>
    )
  },
  { 
    term: "Lateral Resolution", 
    definition: "The ability to distinguish two structures side-by-side (perpendicular to beam). Determined by beam width.", 
    category: "Resolution",
    visual: (
      <div className="flex items-center space-x-3 relative">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2"
        >
          <div className="w-1.5 h-1.5 bg-registry-teal rounded-full shadow-[0_0_5px_rgba(0,245,212,0.5)]" />
          <div className="w-1.5 h-1.5 bg-registry-teal rounded-full shadow-[0_0_5px_rgba(0,245,212,0.5)]" />
        </motion.div>
        <div className="absolute inset-x-0 h-0.5 bg-registry-teal/20 -bottom-2" />
      </div>
    )
  },
  { 
    term: "Temporal Resolution", 
    definition: "The ability to accurately locate moving structures over time; determined by frame rate.", 
    category: "Resolution",
    visual: (
      <div className="flex space-x-1">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-3 h-5 bg-registry-teal rounded-sm"
          />
        ))}
      </div>
    )
  },
  { 
    term: "Contrast Resolution", 
    definition: "The ability to distinguish between different shades of gray (brightness levels).", 
    category: "Resolution",
    visual: (
      <div className="flex space-x-1">
        <motion.div animate={{ backgroundColor: ["#f1f5f9", "#475569", "#f1f5f9"] }} transition={{ duration: 3, repeat: Infinity }} className="w-4 h-4 rounded-sm" />
        <motion.div animate={{ backgroundColor: ["#475569", "#f1f5f9", "#475569"] }} transition={{ duration: 3, repeat: Infinity }} className="w-4 h-4 rounded-sm" />
      </div>
    )
  },

  // INSTRUMENTATION
  { 
    term: "Amplification", 
    definition: "The first receiver function; adjusts the brightness of the entire image (Receiver Gain).", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-center space-x-2">
        <motion.div animate={{ height: [4, 8, 4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 bg-stealth-800 rounded-full" />
        <MoveRight className="w-3 h-3 text-stealth-800" />
        <motion.div animate={{ height: [4, 20, 4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 bg-registry-teal rounded-full" />
      </div>
    )
  },
  { 
    term: "Compensation", 
    definition: "TGC. Receiver function that corrects for attenuation by adjusting brightness based on depth.", 
    category: "Instrumentation",
    visual: (
      <div className="flex flex-col space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-1">
            <div className="w-8 h-1 bg-stealth-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: [`${20*i}%`, `${40*i}%`, `${20*i}%`] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="h-full bg-registry-teal"
              />
            </div>
          </div>
        ))}
      </div>
    )
  },
  { 
    term: "Compression", 
    definition: "Receiver function that reduces the dynamic range of the signals to a range visible to the human eye.", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-center space-x-1">
        <div className="flex flex-col space-y-0.5">
          <div className="w-1 h-6 bg-stealth-800" />
          <div className="w-1 h-2 bg-stealth-800" />
        </div>
        <motion.div animate={{ x: [-2, 2] }} transition={{ repeat: Infinity, duration: 1 }}>
          <ChevronLeft className="w-3 h-3 text-registry-teal" />
        </motion.div>
        <div className="flex flex-col space-y-0.5">
          <div className="w-1 h-4 bg-registry-teal" />
          <div className="w-1 h-3 bg-registry-teal" />
        </div>
      </div>
    )
  },
  { 
    term: "Demodulation", 
    definition: "Receiver function involving rectification and smoothing to convert radio frequency to video signal.", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-center space-x-2">
        <Activity className="w-4 h-4 text-stealth-800" />
        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <MoveRight className="w-3 h-3 text-registry-teal" />
        </motion.div>
        <div className="w-4 h-4 bg-registry-teal/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-1 bg-registry-teal rounded-full" />
        </div>
      </div>
    )
  },
  { 
    term: "Rejection", 
    definition: "Receiver function that eliminates low-level noise below a certain threshold.", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-end space-x-1">
        <motion.div animate={{ height: [2, 0, 2] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 bg-registry-rose/30" />
        <div className="w-1 h-4 bg-registry-teal" />
        <motion.div animate={{ height: [3, 0, 3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="w-1 bg-registry-rose/30" />
        <div className="w-1 h-6 bg-registry-teal" />
      </div>
    )
  },
  { 
    term: "Dynamic Range", 
    definition: "The ratio of the largest to smallest signal amplitudes that a system component can handle, measured in dB.", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-end space-x-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i}
            animate={{ height: [i * 2, i * 4, i * 2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-1.5 bg-registry-teal rounded-t-sm"
          />
        ))}
      </div>
    )
  },
  { 
    term: "Scan Converter", 
    definition: "The hardware that stores image data and converts it from spoke format to video format for display.", 
    category: "Instrumentation",
    visual: (
      <div className="flex items-center space-x-2">
        <div className="relative w-6 h-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-white/10 rounded-full border-t-registry-teal" />
          <Cpu className="absolute inset-0 m-auto w-3 h-3 text-stealth-800" />
        </div>
        <MoveRight className="w-3 h-3 text-registry-teal animate-pulse" />
        <div className="w-6 h-6 bg-registry-teal/10 border border-registry-teal/20 rounded-sm flex items-center justify-center">
          <Monitor className="w-3 h-3 text-registry-teal" />
        </div>
      </div>
    )
  },
  { 
    term: "Bit", 
    definition: "Binary digit. The smallest unit of digital memory, representing a 0 or 1.", 
    category: "Instrumentation",
    visual: (
      <motion.div 
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-8 h-8 bg-registry-teal rounded-full flex items-center justify-center text-white font-black text-xs"
      >
        1
      </motion.div>
    )
  },
  { 
    term: "Pixel", 
    definition: "The smallest building block of a digital picture; higher pixel density equals better spatial resolution.", 
    category: "Instrumentation",
    visual: (
      <div className="grid grid-cols-3 gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-2.5 h-2.5 bg-registry-teal rounded-[1px]"
          />
        ))}
      </div>
    )
  },

  // DOPPLER
  { 
    term: "Aliasing", 
    definition: "The most common artifact in PW Doppler; occurs when the Doppler shift exceeds the Nyquist limit.", 
    category: "Doppler",
    visual: (
      <div className="relative w-12 h-10 bg-slate-900 rounded-sm overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-1 bg-registry-rose shadow-[0_0_8px_rgba(244,63,94,0.8)]"
        />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
      </div>
    )
  },
  { 
    term: "Doppler Shift", 
    definition: "The change in frequency resulting from relative motion between the sound source and the receiver.", 
    category: "Doppler",
    visual: (
      <div className="flex items-center space-x-2">
        <motion.div animate={{ x: [-5, 5] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 bg-registry-teal/20 rounded-full flex items-center justify-center">
          <Waves className="w-2.5 h-2.5 text-registry-teal" />
        </motion.div>
        <div className="flex flex-col space-y-0.5">
          <motion.div animate={{ width: [4, 12, 4] }} transition={{ duration: 1, repeat: Infinity }} className="h-0.5 bg-registry-teal" />
          <motion.div animate={{ width: [12, 4, 12] }} transition={{ duration: 1, repeat: Infinity }} className="h-0.5 bg-registry-teal-secondary" />
        </div>
      </div>
    )
  },
  { 
    term: "Nyquist Limit", 
    definition: "The highest Doppler shift that can be measured without aliasing (1/2 PRF).", 
    category: "Doppler",
    visual: (
      <div className="relative w-12 h-8 flex flex-col justify-center overflow-hidden bg-slate-900 rounded-sm">
        <div className="absolute top-0 w-full h-0.5 bg-rose-500 z-10" />
        <motion.div 
          animate={{ y: [10, -10] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-4 bg-registry-teal/20"
        />
      </div>
    )
  },
  { 
    term: "Wall Filter", 
    definition: "A high-pass filter used to eliminate low-frequency, high-amplitude shifts caused by vessel wall motion (clutter).", 
    category: "Doppler",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-rose-500">
        <path d="M0 18 L 10 18 L 10 5 Q 25 5, 40 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="0" y1="18" x2="10" y2="18" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      </svg>
    )
  },
  { 
    term: "Spectral Broadening", 
    definition: "The filling in of the spectral window, typically indicating turbulent flow or a large sample volume.", 
    category: "Doppler",
    visual: (
      <div className="relative w-12 h-8 bg-slate-900 rounded-sm overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-registry-teal/40 blur-[2px]"
        />
        <div className="absolute bottom-0 w-full h-0.5 bg-white/20" />
      </div>
    )
  },
  { 
    term: "Variance Mode", 
    definition: "Color Doppler map that displays direction and speed (left) plus laminar/turbulent flow (right).", 
    category: "Doppler",
    visual: (
      <div className="flex space-x-1">
        <div className="w-4 h-8 bg-gradient-to-t from-registry-cobalt via-black to-registry-rose rounded-sm" />
        <motion.div 
          animate={{ backgroundColor: ["#00f0ff", "#ffaa00", "#00f0ff"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-4 h-8 rounded-sm"
        />
      </div>
    )
  },

  // HEMODYNAMICS
  { 
    term: "Bernoulli's Principle", 
    definition: "Describes the relationship between velocity and pressure; pressure is lowest where velocity is highest.", 
    category: "Doppler",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-teal">
        <path d="M0 5 L 15 8 L 25 8 L 40 5 L 40 15 L 25 12 L 15 12 L 0 15 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
        <path d="M18 10 L 22 10" stroke="currentColor" strokeWidth="1" />
        <path d="M21 8 L 22 10 L 21 12" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  { 
    term: "Laminar Flow", 
    definition: "Orderly flow where fluid layers travel in parallel; includes plug and parabolic profiles.", 
    category: "Doppler",
    visual: (
      <div className="flex flex-col space-y-1.5">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ x: [-10, 20] }}
            transition={{ duration: 1.5 / i, repeat: Infinity, ease: "linear" }}
            className="w-8 h-0.5 bg-registry-teal rounded-full"
          />
        ))}
      </div>
    )
  },
  { 
    term: "Poiseuille's Law", 
    definition: "Describes the relationship between pressure, flow, and resistance. Radius has the greatest impact on flow.", 
    category: "Doppler",
    visual: (
      <div className="flex items-center space-x-1">
        <div className="w-12 h-4 bg-stealth-800 rounded-full relative overflow-hidden">
          <motion.div 
            animate={{ x: [-20, 40] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-1 bg-registry-teal rounded-full"
          />
          <motion.div 
            animate={{ height: [16, 8, 16] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-y-4 border-stealth-900"
          />
        </div>
      </div>
    )
  },
  { 
    term: "Turbulent Flow", 
    definition: "Chaotic flow patterns characterized by eddies and vortices; associated with spectral broadening.", 
    category: "Doppler",
    visual: (
      <svg width="40" height="20" viewBox="0 0 40 20" className="text-registry-amber">
        <path d="M0 10 C 10 0, 10 20, 20 10 C 30 0, 30 20, 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="10" r="2" fill="currentColor" fillOpacity="0.3" />
        <circle cx="25" cy="10" r="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    )
  },

  // ARTIFACTS
  {
    term: "Shadowing",
    definition: "The reduction in echo amplitude from reflectors that lie behind a strongly attenuating structure (e.g., gallstone).",
    category: "Artifacts",
    clinicalPearl: "Shadowing is a useful artifact! It confirms the presence of a solid, attenuating structure like a calcification or stone.",
    visual: (
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg" alt="Shadowing" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
    )
  },
  {
    term: "Enhancement",
    definition: "The increase in echo amplitude from reflectors that lie behind a weakly attenuating structure (e.g., simple cyst).",
    category: "Artifacts",
    clinicalPearl: "Enhancement proves a structure is fluid-filled. If you see enhancement behind a mass, it's likely a cyst.",
    visual: (
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ultrasound_of_a_normal_kidney.jpg/800px-Ultrasound_of_a_normal_kidney.jpg" alt="Enhancement" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
    )
  },
  {
    term: "Reverberation",
    definition: "Multiple, equally spaced echoes caused by the bouncing of the sound wave between two strong reflectors.",
    category: "Artifacts",
    clinicalPearl: "Reverberation looks like a 'ladder' or 'venetian blinds'. It often occurs at the anterior wall of the bladder or gallbladder.",
    visual: (
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Doppler_ultrasound_of_systolic_velocity_%28Vs%29%2C_diastolic_velocity_%28Vd%29%2C_acceleration_time_%28AoAT%29%2C_systolic_acceleration_%28Ao_Accel%29_and_resistive_index_%28RI%29_of_normal_kidney.jpg" alt="Reverberation" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
    )
  },
  {
    term: "Mirror Image",
    definition: "An artifact created when sound reflects off a strong specular reflector (like the diaphragm) and creates a duplicate image deeper than the real one.",
    category: "Artifacts",
    clinicalPearl: "The 'mirror' is always the strong reflector. The duplicate is always deeper than the real structure.",
    visual: (
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ultrasound_mirror_image_artifact.jpg/800px-Ultrasound_mirror_image_artifact.jpg" alt="Mirror Image" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
    )
  },
  {
    term: "Comet Tail",
    definition: "A form of reverberation artifact with closely spaced echoes, often seen with metallic objects or adenomyomatosis.",
    category: "Artifacts",
    clinicalPearl: "Comet tail is essentially reverberation where the spaces are so small they merge into a solid line.",
    visual: (
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Comet_tail_artifact_on_ultrasound.jpg/800px-Comet_tail_artifact_on_ultrasound.jpg" alt="Comet Tail" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
    )
  },
  {
    term: "Speed Error",
    definition: "Occurs when the assumed speed of sound (1,540 m/s) is incorrect, causing reflectors to be placed at the wrong depth.",
    category: "Artifacts",
    clinicalPearl: "If the medium speed is > 1540 m/s, the reflector is placed too shallow. If < 1540 m/s, it's placed too deep.",
    visual: (
      <div className="flex items-center space-x-2">
        <div className="w-1 h-8 bg-white/20" />
        <div className="flex flex-col space-y-2">
          <div className="w-2 h-2 bg-registry-teal rounded-full" />
          <div className="w-2 h-2 bg-registry-teal/20 rounded-full translate-x-4" />
        </div>
      </div>
    )
  },
  {
    term: "Side Lobes",
    definition: "Secondary sound beams outside the main beam axis, produced by single-crystal transducers.",
    category: "Artifacts",
    visual: (
      <div className="relative w-12 h-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-registry-teal/40" />
        <div className="absolute top-2 left-2 w-1 h-4 bg-registry-teal/10 rotate-[-30deg]" />
        <div className="absolute top-2 right-2 w-1 h-4 bg-registry-teal/10 rotate-[30deg]" />
      </div>
    )
  },

  // RESOLUTION EXPANSION
  {
    term: "Elevational Resolution",
    definition: "Also known as slice thickness; the resolution in the third dimension of the beam.",
    category: "Resolution",
    clinicalPearl: "Slice thickness artifact can cause 'fill-in' of small cystic structures because the beam is wider than the cyst.",
    visual: (
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border border-white/10 rounded-lg skew-x-12" />
        <div className="absolute inset-2 border border-registry-teal rounded-lg skew-x-12" />
      </div>
    )
  },

  // DOPPLER EXPANSION
  {
    term: "Continuous Wave (CW) Doppler",
    definition: "A Doppler technique using two crystals (one constantly sending, one constantly receiving). No aliasing, but no range resolution.",
    category: "Doppler",
    clinicalPearl: "Use CW for very high velocity flows (like severe stenosis) where PW would alias.",
    visual: (
      <div className="flex space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-registry-teal flex items-center justify-center">
          <Repeat className="w-4 h-4 text-registry-teal" />
        </div>
      </div>
    )
  },
  {
    term: "Fast Fourier Transform (FFT)",
    definition: "The mathematical process used to process Pulsed Wave and Continuous Wave Doppler signals into a spectral display.",
    category: "Doppler",
    visual: (
      <div className="grid grid-cols-4 gap-0.5 items-end h-6">
        {[4, 8, 6, 10].map((h, i) => (
          <div key={i} className="w-1.5 bg-registry-teal" style={{ height: `${h*2}px` }} />
        ))}
      </div>
    )
  },
  {
    term: "Autocorrelation",
    definition: "The mathematical process used to process Color Doppler signals; faster but less accurate than FFT.",
    category: "Doppler",
    visual: (
      <div className="flex items-center space-x-1">
        <Binary className="w-4 h-4 text-registry-teal" />
        <div className="w-4 h-4 rounded-full border border-registry-teal/30 animate-spin" />
      </div>
    )
  },

  // INSTRUMENTATION EXPANSION
  {
    term: "Output Power",
    definition: "Adjusts the strength of the sound pulse sent into the body. Affects patient exposure (Bioeffects).",
    category: "Instrumentation",
    clinicalPearl: "To increase image brightness, always increase Receiver Gain first (ALARA). Only increase Output Power if gain is maxed out.",
    visual: (
      <div className="flex items-center space-x-1">
        <Zap className="w-4 h-4 text-registry-rose" />
        <div className="w-8 h-2 bg-stealth-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: ["20%", "90%", "20%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-registry-rose" />
        </div>
      </div>
    )
  },
  {
    term: "Spatial Compounding",
    definition: "A method of using different imaging angles to produce a single real-time image, reducing speckle and shadows.",
    category: "Instrumentation",
    clinicalPearl: "Spatial compounding improves image quality but reduces temporal resolution (frame rate).",
    visual: (
      <div className="relative w-10 h-10">
        <Layers className="w-6 h-6 text-registry-teal absolute top-0 left-0" />
        <Layers className="w-6 h-6 text-registry-teal/40 absolute top-2 left-2" />
        <Layers className="w-6 h-6 text-registry-teal/20 absolute top-4 left-4" />
      </div>
    )
  },
  {
    term: "Fill-in Interpolation",
    definition: "A pre-processing method that predicts gray-scale levels of missing data between scan lines.",
    category: "Instrumentation",
    visual: (
      <div className="grid grid-cols-3 gap-1">
        <div className="w-2 h-2 bg-white" />
        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-registry-teal" />
        <div className="w-2 h-2 bg-white" />
      </div>
    )
  },

  // PHYSICS BASICS EXPANSION
  {
    term: "Acoustic Variables",
    definition: "Pressure, Density, and Distance (particle motion). These are the variables that oscillate in a sound wave.",
    category: "Waves",
    visual: (
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-75" />
        <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce delay-150" />
      </div>
    )
  },
  {
    term: "Stiffness",
    definition: "The ability of a tissue to resist compression. Stiffness is directly related to propagation speed.",
    category: "Waves",
    clinicalPearl: "Stiffness is the opposite of elasticity and compressibility. Bulk Modulus is another word for stiffness.",
    visual: (
      <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center border-2 border-white/20">
        <div className="w-4 h-4 bg-white/10 rounded-sm" />
      </div>
    )
  },
  {
    term: "Grating Lobes",
    definition: "Secondary sound beams outside the main beam axis, produced by array transducers. Can be reduced by apodization and subdicing.",
    category: "Artifacts",
    visual: (
      <div className="relative w-12 h-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-8 bg-registry-teal/40" />
        <div className="flex justify-between w-full px-1">
          <div className="w-0.5 h-4 bg-registry-teal/10 rotate-[-45deg]" />
          <div className="w-0.5 h-4 bg-registry-teal/10 rotate-[45deg]" />
        </div>
      </div>
    )
  },
  {
    term: "Range Ambiguity",
    definition: "An artifact where deep structures are placed too shallow because the next pulse is sent before the previous echo returns.",
    category: "Artifacts",
    clinicalPearl: "To fix range ambiguity, decrease the PRF (increase the imaging depth).",
    visual: (
      <div className="flex flex-col items-center space-y-1">
        <div className="w-8 h-0.5 bg-registry-teal" />
        <div className="w-8 h-0.5 bg-registry-teal/20" />
        <div className="w-8 h-0.5 bg-registry-teal/10" />
      </div>
    )
  },
  {
    term: "Harmonic Imaging",
    definition: "The creation of an image from sound reflections at twice the transmitted frequency (the second harmonic).",
    category: "Instrumentation",
    clinicalPearl: "Harmonics improve image quality by reducing noise and increasing lateral resolution, as the harmonic beam is narrower.",
    visual: (
      <div className="flex items-center space-x-2">
        <Waves className="w-4 h-4 text-slate-500" />
        <MoveRight className="w-3 h-3 text-registry-teal" />
        <div className="flex flex-col -space-y-1">
          <Waves className="w-4 h-4 text-registry-teal" />
          <Waves className="w-4 h-4 text-registry-teal" />
        </div>
      </div>
    )
  },
  {
    term: "Elastography",
    definition: "A dynamic imaging technique that estimates the stiffness of tissues (their elastic properties).",
    category: "Instrumentation",
    clinicalPearl: "Malignant tumors are often stiffer than benign ones. Elastography provides 'virtual palpation'.",
    visual: (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-green-500 to-red-500 opacity-60 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-white rounded-full" />
      </div>
    )
  },
  {
    term: "Contrast Agents",
    definition: "Gas-filled microbubbles injected into the bloodstream to increase the reflectivity of blood.",
    category: "Bioeffects",
    clinicalPearl: "Contrast agents have a different acoustic impedance than blood, creating strong reflections. Monitor MI carefully!",
    visual: (
      <div className="flex space-x-1">
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            className="w-3 h-3 rounded-full border border-registry-teal bg-registry-teal/10" 
          />
        ))}
      </div>
    )
  },
  {
    term: "Audible Sound",
    definition: "Sound waves with frequencies between 20 Hz and 20,000 Hz, detectable by the human ear.",
    category: "Waves",
    visual: <Volume2 className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Diagnostic Ultrasound",
    definition: "Ultrasound used for medical imaging, typically ranging from 2 MHz to 20 MHz.",
    category: "Waves",
    visual: <Stethoscope className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Bulk Modulus",
    definition: "A measure of a medium's resistance to compression (stiffness). Directly related to propagation speed.",
    category: "Waves",
    visual: <Maximize2 className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Rayls",
    definition: "The unit of acoustic impedance (Z). 1 Rayl = 1 kg/(m²·s).",
    category: "Media Interaction",
    visual: <Hash className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Snell's Law",
    definition: "The formula used to calculate the angle of refraction: sin(θt)/sin(θi) = c2/c1.",
    category: "Media Interaction",
    visual: <MoveRight className="w-4 h-4 text-registry-teal rotate-45" />
  },
  {
    term: "Critical Angle",
    definition: "The incident angle at which total internal reflection occurs and no sound is transmitted into the second medium.",
    category: "Media Interaction",
    visual: <X className="w-4 h-4 text-registry-rose" />
  },
  {
    term: "Apodization",
    definition: "The process of varying the voltage to individual elements in an array to reduce side lobes and grating lobes.",
    category: "Transducers",
    visual: <Zap className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Rectification",
    definition: "A step in demodulation that converts all negative voltages into positive voltages.",
    category: "Instrumentation",
    visual: <ArrowDownUp className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Enveloping",
    definition: "Also called smoothing; a step in demodulation that creates a smooth line around the rectified peaks.",
    category: "Instrumentation",
    visual: <Waves className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "DICOM",
    definition: "Digital Imaging and Communications in Medicine. The standard protocol for medical imaging data exchange.",
    category: "Instrumentation",
    visual: <Binary className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "PACS",
    definition: "Picture Archiving and Communication System. The digital storage and retrieval system for medical images.",
    category: "Instrumentation",
    visual: <Monitor className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Frame Rate",
    definition: "The number of images (frames) displayed per second, measured in Hertz (Hz). Higher frame rate equals better temporal resolution.",
    category: "Instrumentation",
    clinicalPearl: "Frame rate is limited by imaging depth and the number of pulses per scan line.",
    visual: <Repeat className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Line Density",
    definition: "The number of scan lines per degree or per centimeter in an image.",
    category: "Instrumentation",
    clinicalPearl: "Higher line density improves spatial resolution but decreases frame rate (temporal resolution).",
    visual: <Layers className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Persistence",
    definition: "Also called temporal averaging; a processing technique that averages multiple previous frames to create a smoother image with less noise.",
    category: "Instrumentation",
    clinicalPearl: "Persistence is great for stationary structures but causes blurring of moving structures like the heart.",
    visual: <Clock className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Frequency Compounding",
    definition: "An image processing method where the reflected signal is divided into sub-bands of frequencies, which are then combined to reduce noise and speckle.",
    category: "Instrumentation",
    visual: <Waves className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Coded Excitation",
    definition: "A sophisticated method of improving image quality by creating very long sound pulses with complex patterns of frequencies.",
    category: "Instrumentation",
    clinicalPearl: "Coded excitation improves signal-to-noise ratio, axial resolution, and penetration.",
    visual: <Binary className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "A-Mode",
    definition: "Amplitude mode; displays the strength of reflections as vertical spikes on a graph. Used for precise distance measurements.",
    category: "Instrumentation",
    visual: <Activity className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "M-Mode",
    definition: "Motion mode; displays the movement of reflectors over time. Used for cardiac and fetal heart rate assessment.",
    category: "Instrumentation",
    visual: <Timer className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Pressure Gradient",
    definition: "The difference in pressure between two points; the driving force behind fluid flow.",
    category: "Doppler",
    visual: <ArrowDownUp className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Resistance",
    definition: "The opposition to flow, determined by the length and radius of the vessel and the viscosity of the fluid.",
    category: "Doppler",
    visual: <X className="w-4 h-4 text-registry-rose" />
  },
  {
    term: "Viscosity",
    definition: "The internal friction of a fluid; its 'thickness'. Measured in Poise.",
    category: "Doppler",
    visual: <Waves className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Inertia",
    definition: "The tendency of a fluid to resist changes in its velocity.",
    category: "Doppler",
    visual: <Zap className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Pulsatility",
    definition: "Flow that varies with the cardiac cycle, typical of arterial circulation.",
    category: "Doppler",
    visual: <Activity className="w-4 h-4 text-registry-rose" />
  },
  {
    term: "Bruit",
    definition: "An abnormal sound heard with a stethoscope, caused by turbulent blood flow in an artery.",
    category: "Doppler",
    visual: <Volume2 className="w-4 h-4 text-registry-teal" />
  },
  {
    term: "Thrill",
    definition: "A palpable vibration felt over a vessel, caused by turbulent blood flow.",
    category: "Doppler",
    visual: <Activity className="w-4 h-4 text-registry-teal" />
  }
];

export const Glossary: React.FC<GlossaryProps> = ({ 
  onClose, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode,
  profile,
  onUpdateProfile
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [fullscreenTerm, setFullscreenTerm] = useState<GlossaryTerm | null>(null);

  const handleNeuralExplain = async (term: string) => {
    if (explainingId === term) return;
    setExplainingId(term);
    try {
      const prompt = `Provide a detailed, high-yield ultrasound physics explanation for the SPI exam term: "${term}". 
      Include key formulas if applicable, clinical relevance, and a "Neural Tip" for remembering it. 
      Format with clear headings and bullet points. Max 150 words.`;
      const explanation = await generateText(prompt);
      if (explanation && onUpdateProfile) {
        onUpdateProfile({
          lexiconAIExplainers: {
            ...(profile?.lexiconAIExplainers || {}),
            [term]: explanation
          }
        });
      }
    } catch (e) {
      console.error("Neural Explain Error", e);
      toast.error("Neural Link Interrupted. Please try again.");
    } finally {
      setExplainingId(null);
    }
  };

  const handleRemoveOverride = (term: string) => {
    if (onUpdateProfile) {
      const nextOverrides = { ...(profile?.lexiconOverrides || {}) };
      delete nextOverrides[term];
      onUpdateProfile({ lexiconOverrides: nextOverrides });
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(SPI_GLOSSARY.map(t => t.category));
    return Array.from(cats).sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return SPI_GLOSSARY.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || 
                           t.definition.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  const handleTermClick = (linkedTerm: string) => {
    setSearch(linkedTerm);
    setActiveCategory(null);
  };

  const renderDefinitionWithLinks = (text: string) => {
    const terms = SPI_GLOSSARY.map(t => t.term).sort((a, b) => b.length - a.length);
    // Escape special characters and create regex
    const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const match = terms.find(t => t.toLowerCase() === part.toLowerCase());
      if (match) {
        return (
          <button 
            key={i} 
            onClick={() => handleTermClick(match)}
            className="text-registry-teal font-black hover:underline underline-offset-4 decoration-2"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className={`fixed inset-0 z-[200] ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} flex flex-col overflow-hidden transition-colors duration-500`}>
      <div className={`absolute inset-0 neural-grid ${isDarkMode ? 'opacity-20' : 'opacity-5'} pointer-events-none`} />
      <div className={`absolute inset-0 scanline ${isDarkMode ? 'opacity-5' : 'opacity-2'} pointer-events-none`} />
      
      {/* Header */}
      <header className={`relative z-10 border-b ${isDarkMode ? 'border-white/10 bg-stealth-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl px-6 py-4 flex items-center justify-between shrink-0 transition-colors duration-300`}>
        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={onClose} className={`p-2 -ml-2 ${isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`} title="Close Glossary">
            <X className="w-6 h-6" />
          </button>
          <div className={`p-2 ${isDarkMode ? 'bg-registry-teal/10 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'} rounded-xl border`}>
            <Book className="w-5 h-5 text-registry-teal" />
          </div>
          <div>
            <h4 className={`text-base md:text-xl font-black italic uppercase tracking-tighter leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Physics Lexicon Vault</h4>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
              <span className={`text-[8px] md:text-[10px] font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-[0.2em]`}>Registry Node: ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onPlayNarration && (
            <button 
              onClick={() => onPlayNarration("Glossary of Ultrasound Physics and Instrumentation Terms", "glossary_intro")} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse text-white' : isDarkMode ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <FullscreenToggle className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white/70' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} border-none`} iconClassName="w-5 h-5" />
        </div>
      </header>

      <div className={`relative z-10 p-4 md:p-6 space-y-4 md:space-y-6 border-b ${isDarkMode ? 'border-white/5 bg-stealth-950/50' : 'border-slate-200 bg-white/50'} backdrop-blur-md transition-colors duration-300`}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            placeholder="SEARCH REGISTRY TERMS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-11 md:pl-12 pr-12 py-3 md:py-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-registry-teal/50' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-registry-teal/30'} border rounded-xl md:rounded-2xl font-black text-xs md:text-sm outline-none transition-all shadow-sm`}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${!activeCategory ? 'bg-registry-teal text-white shadow-[0_0_15px_rgba(45,212,191,0.3)]' : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'}`}
          >
            All Protocols
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-registry-teal text-white shadow-[0_0_15px_rgba(45,212,191,0.3)]' : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} relative z-10 transition-colors duration-500`}>
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
            {filteredTerms.map((term, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.01 }}
                className={`${isDarkMode ? 'bg-stealth-900/50 border-white/5 hover:border-registry-teal/30 hover:bg-stealth-900' : 'bg-white border-slate-200 hover:border-registry-teal/20 hover:shadow-lg'} p-5 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all group overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {onPlayNarration && (
                        <button 
                          onClick={() => onPlayNarration(`${term.term}: ${term.definition}`, `glossary_${idx}`)}
                          disabled={isTtsLoading}
                          className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose text-white animate-pulse' : isDarkMode ? 'bg-white/5 text-slate-400 hover:text-registry-teal' : 'bg-slate-50 text-slate-400 hover:text-registry-teal'}`}
                        >
                          {isTtsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isNarrating ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      )}
                      <button 
                        onClick={() => handleNeuralExplain(term.term)}
                        disabled={explainingId === term.term}
                        className={`p-2 rounded-xl transition-all ${explainingId === term.term ? 'bg-registry-teal/20 animate-pulse' : isDarkMode ? 'bg-white/5 text-slate-400 hover:text-registry-teal' : 'bg-slate-50 text-slate-400 hover:text-registry-teal'}`}
                        title="Neural AI Explain"
                      >
                        {explainingId === term.term ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => setFullscreenTerm(term)}
                        className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-registry-teal' : 'bg-slate-50 text-slate-400 hover:text-registry-teal'}`}
                        title="Focus Mode"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <div className={`p-2 ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-registry-teal/20' : 'bg-slate-50 border-slate-200 group-hover:border-registry-teal/10'} rounded-lg border transition-colors`}>
                        <Bookmark className="w-4 h-4 text-registry-teal" />
                      </div>
                    </div>
                    <div>
                      <h5 className={`text-base md:text-xl font-black italic uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-registry-teal transition-colors leading-tight`}>{term.term}</h5>
                      <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>{term.category}</span>
                    </div>
                  </div>
                  {profile?.lexiconOverrides?.[term.term] ? (
                    <div className="relative group/asset shrink-0">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-registry-teal/30 shadow-lg">
                        {profile.lexiconOverrides[term.term].type === 'video' ? (
                          profile.lexiconOverrides[term.term].data ? (
                            <video src={profile.lexiconOverrides[term.term].data} className="w-full h-full object-cover" muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                          ) : null
                        ) : (
                          profile.lexiconOverrides[term.term].data ? (
                            <img src={profile.lexiconOverrides[term.term].data} alt={term.term} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : null
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemoveOverride(term.term)}
                        className="absolute -top-2 -right-2 p-1 bg-registry-rose text-white rounded-full opacity-0 group-hover/asset:opacity-100 transition-opacity shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : term.visual && (
                    <div className={`shrink-0 p-3 ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-registry-teal/20' : 'bg-slate-50 border-slate-200 group-hover:border-registry-teal/10'} rounded-xl border flex items-center justify-center min-w-[60px] transition-colors`}>
                      {term.visual}
                    </div>
                  )}
                </div>
                <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                  {renderDefinitionWithLinks(term.definition)}
                </p>

                {profile?.lexiconAIExplainers?.[term.term] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-stealth-950/50 border-registry-teal/20' : 'bg-slate-50 border-registry-teal/10'} relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Brain className="w-12 h-12 text-registry-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1 h-1 bg-registry-teal rounded-full animate-ping" />
                        <span className="text-[8px] font-black uppercase text-registry-teal tracking-widest">Neural AI Insight</span>
                      </div>
                      <div className={`text-[10px] md:text-xs font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>
                        {profile.lexiconAIExplainers[term.term]}
                      </div>
                    </div>
                  </motion.div>
                )}
                {term.clinicalPearl && (
                  <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-registry-teal/5 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'} relative overflow-hidden group/pearl`}>
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/pearl:opacity-10 transition-opacity">
                      <Stethoscope className="w-8 h-8 text-registry-teal" />
                    </div>
                    <div className="relative z-10 flex items-start space-x-3">
                      <Zap className="w-3 h-3 text-registry-teal mt-0.5 shrink-0" />
                      <p className={`text-[10px] md:text-xs font-bold italic leading-relaxed ${isDarkMode ? 'text-teal-400/80' : 'text-teal-600/80'}`}>
                        <span className="uppercase font-black mr-1 tracking-widest">Clinical Pearl:</span>
                        {renderDefinitionWithLinks(term.clinicalPearl)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-20 text-center opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <Search className="w-12 h-12 md:w-16 md:h-16 mb-4" />
            <p className="text-lg md:text-xl font-black uppercase italic">No Protocols Found</p>
            <p className="text-xs md:text-sm font-bold mt-1">Adjust search parameters or category filter</p>
          </div>
        )}
      </div>

      <footer className={`p-4 md:p-6 border-t ${isDarkMode ? 'border-white/10 bg-stealth-950 text-slate-400' : 'border-slate-200 bg-white text-slate-500'} text-center pb-24 md:pb-6 transition-colors`}>
        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em]">Source: ARDMS SPI Content Outline</p>
      </footer>

      <AnimatePresence>
        {fullscreenTerm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-stealth-950/95 backdrop-blur-2xl p-6 md:p-20 overflow-y-auto flex items-center justify-center"
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setFullscreenTerm(null)}
              className="fixed top-8 right-8 p-4 bg-white/10 border border-white/10 text-white rounded-full hover:bg-registry-rose hover:border-registry-rose transition-all z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.div 
              layoutId={`term-${fullscreenTerm.term}`}
              className="max-w-4xl w-full space-y-12"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
                <div className="space-y-6 flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                    <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
                      {fullscreenTerm.term}
                    </h2>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-registry-teal bg-registry-teal/10 px-4 py-2 rounded-full border border-registry-teal/20 mb-2">
                      {fullscreenTerm.category}
                    </span>
                  </div>
                  <p className="text-xl md:text-3xl font-medium text-slate-300 leading-relaxed italic">
                    {renderDefinitionWithLinks(fullscreenTerm.definition)}
                  </p>
                </div>
                
                <div className="p-12 md:p-20 bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center min-w-[300px] min-h-[300px] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-registry-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="scale-[2.5] md:scale-[3.5] relative z-10">
                    {profile?.lexiconOverrides?.[fullscreenTerm.term] ? (
                       profile.lexiconOverrides[fullscreenTerm.term].type === 'video' ? (
                        profile.lexiconOverrides[fullscreenTerm.term].data ? (
                          <video src={profile.lexiconOverrides[fullscreenTerm.term].data} className="w-16 h-12 object-cover rounded-sm" muted loop autoPlay />
                        ) : null
                      ) : (
                        profile.lexiconOverrides[fullscreenTerm.term].data ? (
                          <img src={profile.lexiconOverrides[fullscreenTerm.term].data} alt={fullscreenTerm.term} className="w-16 h-12 object-cover rounded-sm" referrerPolicy="no-referrer" />
                        ) : null
                      )
                    ) : (
                      fullscreenTerm.visual
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {fullscreenTerm.clinicalPearl && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-10 bg-registry-rose/10 border border-registry-rose/20 rounded-[3rem] space-y-4 relative overflow-hidden group/pearl"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/pearl:opacity-20 transition-opacity">
                      <Stethoscope className="w-32 h-32 text-registry-rose" />
                    </div>
                    <div className="flex items-center space-x-3 text-registry-rose">
                      <Zap className="w-6 h-6 animate-pulse" />
                      <span className="text-sm font-black uppercase tracking-widest">Clinical Protocol</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold italic leading-relaxed text-slate-200">
                      {renderDefinitionWithLinks(fullscreenTerm.clinicalPearl)}
                    </p>
                  </motion.div>
                )}

                {profile?.lexiconAIExplainers?.[fullscreenTerm.term] && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-10 bg-registry-teal/10 border border-registry-teal/20 rounded-[3rem] space-y-4 relative overflow-hidden group/explain"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/explain:opacity-20 transition-opacity">
                      <Brain className="w-32 h-32 text-registry-teal" />
                    </div>
                    <div className="flex items-center space-x-3 text-registry-teal">
                      <div className="w-2 h-2 bg-registry-teal rounded-full animate-ping" />
                      <span className="text-sm font-black uppercase tracking-widest">Neural Insight</span>
                    </div>
                    <div className="text-sm md:text-base font-medium leading-relaxed text-slate-300 whitespace-pre-wrap">
                      {profile.lexiconAIExplainers[fullscreenTerm.term]}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};