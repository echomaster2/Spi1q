import React, { useState, useMemo } from 'react';
import { Search, X, Book, Hash, ChevronLeft, Bookmark, Waves, Volume2, Pause, Loader2, Zap, Activity, Shield, Thermometer, Maximize2, MoveRight, Repeat, ArrowDownUp, Layers, Cpu, Binary, Monitor, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import { FullscreenToggle } from './FullscreenToggle';
import { GlossaryTerm } from '../types';

const SPI_GLOSSARY: GlossaryTerm[] = [
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
  }
];

interface GlossaryProps {
  onClose: () => void;
  onPlayNarration?: (text: string, id: string) => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode?: boolean;
}

export const Glossary: React.FC<GlossaryProps> = ({ 
  onClose, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
            className={`w-full pl-11 md:pl-12 pr-4 py-3 md:py-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-registry-teal/50' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-registry-teal/30'} border rounded-xl md:rounded-2xl font-black text-xs md:text-sm outline-none transition-all shadow-sm`}
          />
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
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
                      <div className={`p-2 ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-registry-teal/20' : 'bg-slate-50 border-slate-200 group-hover:border-registry-teal/10'} rounded-lg border transition-colors`}>
                        <Bookmark className="w-4 h-4 text-registry-teal" />
                      </div>
                    </div>
                    <div>
                      <h5 className={`text-base md:text-xl font-black italic uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} group-hover:text-registry-teal transition-colors leading-tight`}>{term.term}</h5>
                      <span className={`text-[8px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>{term.category}</span>
                    </div>
                  </div>
                  {term.visual && (
                    <div className={`shrink-0 p-3 ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-registry-teal/20' : 'bg-slate-50 border-slate-200 group-hover:border-registry-teal/10'} rounded-xl border flex items-center justify-center min-w-[60px] transition-colors`}>
                      {term.visual}
                    </div>
                  )}
                </div>
                <p className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                  {term.definition}
                </p>
                {term.clinicalPearl && (
                  <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-registry-teal/5 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'} relative overflow-hidden group/pearl`}>
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/pearl:opacity-10 transition-opacity">
                      <Stethoscope className="w-8 h-8 text-registry-teal" />
                    </div>
                    <div className="relative z-10 flex items-start space-x-3">
                      <Zap className="w-3 h-3 text-registry-teal mt-0.5 shrink-0" />
                      <p className={`text-[10px] md:text-xs font-bold italic leading-relaxed ${isDarkMode ? 'text-teal-400/80' : 'text-teal-600/80'}`}>
                        <span className="uppercase font-black mr-1 tracking-widest">Clinical Pearl:</span>
                        {term.clinicalPearl}
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
    </div>
  );
};