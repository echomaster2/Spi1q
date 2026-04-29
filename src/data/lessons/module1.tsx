import React from 'react';
import { 
  LongitudinalWaveVisual, 
  SpeedOfSoundTable, 
  WaveParametersVisual, 
  IntensityProfileVisual, 
  ReflectionLab, 
  RefractionLab, 
  ScatteringLab, 
  SpecularScatteringVisual, 
  WaveInteractionVisual, 
  AcousticImpedanceVisual, 
  AttenuationSimulator,
  ResolutionComparison,
  PulseEchoVisual,
  LectureTag,
  KnowledgeVisual,
  VideoTutorialLink
} from '../../components/VisualElements';
import { LessonAnthem } from '../../components/LessonAnthem';
import { Layers, Zap, Sparkles, Activity, Waves, Timer } from 'lucide-react';
import { LessonData } from '../../types';

export const module1Lessons: Record<string, LessonData> = {
  "1.1": {
    title: "The Nature of Sound",
    narrationScript: "Welcome to the foundation of everything we do in ultrasound. I've distilled hundreds of hours of physics lectures and textbooks into this masterclass to save you weeks of study time. Today's roadmap: Part 1: Definitions—What actually makes sound 'ultrasound'? Part 2: Core Concepts—Frequency, Wavelength, and the speed of sound in tissue. Part 3: Practical Application—Choosing the right transducer for the job. Part 4: The 'Holy Sh*t' Insight—The ultimate trade-off between resolution and depth. Ultrasound isn't just a noise; it's a mechanical, longitudinal wave. Think of it like a crowded concert crowd—the wave of energy travels differently through 'stiff' bone than through 'squishy' air. Remember, you don't rise to the level of your goals; you fall to the level of your systems. Let's build your system for understanding sound. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on The Nature of Sound.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Physics Basics Deep Dive" />
        <LongitudinalWaveVisual />
        <LessonAnthem stationName="Sound Waves" />
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">Sound is not just a noise; it's a <strong>mechanical disturbance</strong> that travels through a medium. Without molecules to bump into each other, sound simply cannot exist.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          <KnowledgeVisual 
            title="Frequency of Sound" 
            description="Frequency of sound is the number of cycles per second (s) and is expressed in Hertz (1 cycle / sec). In clinical imaging, we use Megahertz (MHz)." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Wave Amplitude" 
            description="Amplitude (A) is defined by the difference between the peak (maximum) or trough (minimum) of the wave and the average value. Units of amplitude are expressed in million Pascals (MPa)." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png"
            isDarkMode={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <LectureTag type="Concept" label="Mechanical Wave" content="A wave that requires a physical medium (like tissue, air, or water) to propagate. It cannot travel in a vacuum." />
          <LectureTag type="Def" label="Longitudinal Wave" content="A wave where particle vibration is parallel to the direction of wave travel. One cycle = 1 compression + 1 rarefaction." />
          <LectureTag type="Not" label="Vacuum Travel" content="Many students think sound can travel in space like light. It cannot. No medium = No sound." />
          <LectureTag type="Tip" label="Registry Rule" content="Propagation speed is totally dependent on the medium only. It is NOT affected by frequency or wavelength." />
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
    clinicalImages: [
      {
        url: "https://www.youtube.com/embed/O_1vR11cM4o",
        caption: "Video: Ultrasound Physics Basics Overview"
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg",
        caption: "Echogenicity - Note the hyperechoic femur, the hypoechoic soft tissue in the thigh and anechoic amniotic fluid."
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ultrasound_liver_right_lobe_and_right_kidney.jpg/800px-Ultrasound_liver_right_lobe_and_right_kidney.jpg",
        caption: "Normal Liver Ultrasound - Note the echogenic diaphragm and homogeneous liver parenchyma."
      }
    ],
    quiz: { id: "q1.1", type: "mcq", question: "If a sound wave has a frequency of 5 Hertz, how many cycles occur in 2 seconds?", options: ["5 cycles", "10 cycles", "2.5 cycles", "20 cycles"], correctAnswer: 1, explanation: "Frequency is cycles per second. 5 Hz means 5 cycles per second. In 2 seconds, 5 * 2 = 10 cycles occur.", visualContext: <LongitudinalWaveVisual /> }
  },
  "1.2": {
    title: "Essential Wave Parameters",
    narrationScript: "I spent weeks analyzing every SPI exam question on wave parameters so you don't have to, so here is the cliffnotes version to save you 40 hours of study time. Today's roadmap: Part 1: The Big Seven Parameters. Part 2: What you can change vs what the system controls. Part 3: The practical application of frequency. Part 4: The 'Holy Sh*t' Insight about wavelength and resolution. The easiest way to first define these parameters is to look at what they are not—they are not independent. They are all linked. Here is a mnemonic in case you can't remember the big seven... just think about 'Pigs Powerfully Intimidate Farmers While Speeding Away' - Period, Power, Intensity, Frequency, Wavelength, Speed, Amplitude. Think of these parameters like a car trip. Speed is how fast you're driving, Frequency is how many trips you make, and Wavelength is the distance of each trip. In this lesson, we use the Master Oscilloscope to visualize these relationships in real-time. If you can answer the final assessment questions then congratulations, you can consider yourself educated on Wave Parameters.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Frequency & Period" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Wavelength (λ)" 
            description="The wavelength of a sound wave is the length of a wave and is defined as the distance of a complete cycle. It is expressed in mm. λ = c / f." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png"
            isDarkMode={true}
          />
          <WaveParametersVisual />
        </div>

        <section className="mt-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal text-center">Mastering Image Quality</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <ResolutionComparison />
        </section>

        <section className="space-y-6">
          <h4 className="text-2xl font-black italic uppercase tracking-tighter">The Interconnected Big 7</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="premium-glass p-6 rounded-3xl border border-white/5 space-y-4">
                <h5 className="text-registry-teal font-black uppercase text-xs">Temporal (Time)</h5>
                <ul className="text-sm font-bold text-slate-400 space-y-2">
                   <li>• Period (T): Time for 1 cycle</li>
                   <li>• Frequency (f): Cycles per second</li>
                </ul>
                <p className="text-[10px] italic text-slate-500">Determined by: Sound Source Only</p>
             </div>
             <div className="premium-glass p-6 rounded-3xl border border-white/5 space-y-4">
                <h5 className="text-registry-amber font-black uppercase text-xs">Strength (Magnitude)</h5>
                <ul className="text-sm font-bold text-slate-400 space-y-2">
                   <li>• Amplitude (A): 'Bigness' of wave</li>
                   <li>• Power (P): Rate of energy transfer</li>
                   <li>• Intensity (I): Concentration of energy</li>
                </ul>
                <p className="text-[10px] italic text-slate-500">Adjustable by Sonographer: YES</p>
             </div>
             <div className="premium-glass p-6 rounded-3xl border border-white/5 space-y-4">
                <h5 className="text-registry-rose font-black uppercase text-xs">Spatial (Space/Medium)</h5>
                <ul className="text-sm font-bold text-slate-400 space-y-2">
                   <li>• Wavelength (λ): Length of 1 cycle</li>
                   <li>• Prop. Speed (c): Speed in medium</li>
                </ul>
                <p className="text-[10px] italic text-slate-500">Wavelength: Source & Medium | Speed: Medium ONLY</p>
             </div>
          </div>
        </section>

        <LessonAnthem stationName="Propagation Speed" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Frequency" content="Number of cycles per second. Measured in Hertz (Hz). Diagnostic US: 2-15 MHz." />
            <LectureTag type="Def" label="Wavelength" content="The distance or length of one complete cycle. λ = c/f. Typical values: 0.1 - 0.8 mm." />
            <LectureTag type="Tip" label="Inverse Relationship" content="Higher Frequency = Shorter Wavelength = Better Resolution but Less Penetration." />
            <LectureTag type="Tip" label="Calculated Wavelength" content="λ (mm) = 1.54 / Frequency (MHz). At 2MHz, λ is 0.77mm. At 10MHz, λ is 0.15mm." />
            <LectureTag type="Not" label="Magnitude & Freq" content="Amplitude, Power, and Intensity describe wave strength. They are NOT related to frequency or wavelength." />
          </div>
          <IntensityProfileVisual />
        </div>
        
        <div className="premium-glass p-8 rounded-[3rem] border border-white/10 relative overflow-hidden bg-registry-teal/5">
           <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-registry-teal opacity-10" />
           <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-3 text-registry-teal" />
              The "Power" Rule of Thumb
           </h4>
           <p className="text-sm leading-relaxed italic opacity-90">
              When Amplitude triples, Power increases by 9x. When Amplitude is halved, Power drops to 1/4. Always think in <strong>squares</strong> when comparing these two!
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LessonAnthem stationName="Intensity" />
            <LessonAnthem stationName="Power & Area" />
            <LectureTag type="Concept" label="Intensity" content="Concentration of energy in a sound beam. Intensity (W/cm²) = Power (W) / Area (cm²)." />
            <LectureTag type="Not" label="Beam Focusing" content="When a beam is focused, the area decreases. Even if power is constant, the intensity skyrockets!" />
          </div>
          <div className="p-8 bg-slate-100 dark:bg-stealth-900 rounded-[2.5rem] border border-slate-200 dark:border-stealth-800">
             <h4 className="text-xl font-black uppercase italic mb-6">Mnemonic: Pigs Powerfully Intimidate Farmers While Speeding Away</h4>
             <ul className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-tight text-slate-600 dark:text-stealth-400">
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Period (T)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Power (P)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Intensity (I)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Frequency (f)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Wavelength (λ)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Speed (c)</span></li>
               <li className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-registry-teal" /> <span>Amplitude (A)</span></li>
             </ul>
          </div>
        </div>
      </div>
    ),
    quiz: { id: "q1.2", type: "mcq", question: "As frequency increases, what happens to the wavelength in a given medium?", options: ["Increases", "Decreases", "Stays the same", "Doubles"], correctAnswer: 1, explanation: "Wavelength and frequency are inversely proportional (λ = c/f). As frequency increases, wavelength decreases.", visualContext: <WaveParametersVisual /> }
  },
  "1.3": {
    title: "Interaction with Media",
    narrationScript: "I reviewed every single textbook chapter on acoustic interactions for you, condensing it here to save you 8 hours of reading. Today's roadmap: Part 1: Reflection and Refraction. Part 2: Scattering and Absorption. Part 3: Practical application in imaging. Part 4: The 'Holy Sh*t' Insight about acoustic impedance. Reflection is sound bouncing off a boundary, like light hitting a mirror. But Refraction is the bending of that beam, often creating 'ghost images' or lateral displacement. Here is a mnemonic for the interactions: 'Really Red Snakes Attack' - Reflection, Refraction, Scattering, Absorption. If you don't use gel, you create a massive impedance mismatch. The air is the 'wall' that reflects 100% of your signal. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Interaction with Media.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Attenuation" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Reflection and Refraction" 
            description="Reflection occurs when sound hits a boundary between two media with different acoustic impedances. Refraction is the bending of the sound beam as it passes from one medium to another." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Reflection_and_refraction.svg/800px-Reflection_and_refraction.svg.png"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Scattering and Absorption" 
            description="Scattering is the redirection of sound in many directions by small or rough surfaces. Absorption is the conversion of sound energy into heat." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Reflection_and_refraction.svg/800px-Reflection_and_refraction.svg.png"
            isDarkMode={true}
          />
        </div>

        <section className="space-y-6">
           <h4 className="text-2xl font-black italic uppercase tracking-tighter">The Mechanics of Attenuation</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                 <div className="w-10 h-10 bg-registry-teal/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-registry-teal" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Reflection</h5>
                 <p className="text-xs text-slate-400 leading-relaxed">Specular reflection occurs at large, smooth boundaries (like the diaphragm). It's highly angle-dependent.</p>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                 <div className="w-10 h-10 bg-registry-rose/10 rounded-xl flex items-center justify-center">
                    <Waves className="w-6 h-6 text-registry-rose" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Scattering</h5>
                 <p className="text-xs text-slate-400 leading-relaxed">Disorganized reflection from small reflectors (like red blood cells). It creates the 'texture' of tissue.</p>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                 <div className="w-10 h-10 bg-registry-rose/10 rounded-xl flex items-center justify-center">
                    <Waves className="w-6 h-6 text-registry-rose" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Rayleigh Scattering</h5>
                 <p className="text-xs text-slate-400 leading-relaxed">A special case where reflectors are <strong>much smaller</strong> than the wavelength (e.g., Red Blood Cells). It results in uniform redirection in all directions. Proportional to frequency to the fourth power (f⁴).</p>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                 <div className="w-10 h-10 bg-registry-amber/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-registry-amber" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Absorption</h5>
                 <p className="text-xs text-slate-400 leading-relaxed">Conversion of sound into heat. This is the largest component of attenuation in soft tissue.</p>
              </div>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReflectionLab />
          <RefractionLab />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScatteringLab />
          <SpecularScatteringVisual />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WaveInteractionVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Acoustic Impedance" content="The resistance to sound travel (Z = Density × Speed). Measured in Rayls (Z)." />
            <LectureTag type="Not" label="Refraction" content="Refraction requires two things: Oblique incidence AND different propagation speeds. Without both, no bending occurs (Snell's Law)." />
            <LectureTag type="Tip" label="Reflection Rule" content="Reflection = Impedance Mismatch. The greater the mismatch, the stronger the reflection." />
            <LectureTag type="Def" label="Rayleigh Scattering" content="Frequency⁴ relation. Small reflectors like RBCs. It redirects sound in all directions uniformly." />
            <LectureTag type="Def" label="Critical Angle" content="The angle at which total internal reflection occurs, preventing any sound from entering the second medium." />
          </div>
        </div>
        <AcousticImpedanceVisual />
        
        <div className="mt-12 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal">Deep Dive: Attenuation Physics</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <AttenuationSimulator />
          <div className="bg-stealth-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-4">
             <h4 className="text-xl font-black uppercase italic text-registry-rose">The Attenuation Formula</h4>
             <p className="text-sm font-mono text-slate-300">Total Attenuation (dB) = Atten. Coeff. (dB/cm) × Path Length (cm)</p>
             <p className="text-xs text-slate-500 leading-relaxed">
                In soft tissue, the average attenuation coefficient is <span className="text-white font-bold">0.5 dB / cm / MHz</span>. 
                This means higher frequency sound attenuates faster, limiting your imaging depth.
             </p>
          </div>
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ultrasound_of_left_kidney_lower_pole_with_stone.jpg/800px-Ultrasound_of_left_kidney_lower_pole_with_stone.jpg",
        caption: "Normal Kidney Ultrasound - Demonstrating varying acoustic impedance between the renal cortex and sinus."
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ultrasound_image_of_spleen_110315151544_1516020.jpg/800px-Ultrasound_image_of_spleen_110315151544_1516020.jpg",
        caption: "Normal Spleen Ultrasound - Showing homogeneous echotexture and sound propagation."
      }
    ],
    quiz: { id: "q1.3", type: "mcq", question: "What two conditions are required for refraction to occur?", options: ["Normal incidence and same speed", "Oblique incidence and different speeds", "Normal incidence and different speeds", "Oblique incidence and same speed"], correctAnswer: 1, explanation: "Refraction requires oblique incidence (not 90 degrees) and a difference in propagation speeds between the two media.", visualContext: <WaveInteractionVisual /> }
  },
  "1.4": {
    title: "The Range Equation & Timing",
    narrationScript: "How does the machine know exactly where to put a dot on the screen? It's all about the stopwatch. Today's roadmap: Part 1: The 13 Microsecond Rule. Part 2: Go-Return Time vs Reflector Depth. Part 3: Total Path Length. Part 4: The 'Holy Sh*t' Insight about depth and Pulse Repetition Frequency. For every 1 cm deeper a reflector sits, it takes sound 13 microseconds longer to return. This is the foundation of pulsed-wave imaging. If the machine emits a pulse and waits 52 microseconds, it knows the echo it hears just then must be coming from exactly 4 cm deep. Let's calibrate your sense of ultrasound timing. If you can answer these questions then congratulations, you can consider yourself educated on the Range Equation.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Range Equation Deep Dive" />
        <PulseEchoVisual />
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>Range Equation</strong> is the mathematical bridge between time and distance. In ultrasound, we don't measure distance directly; we measure <em>time</em> and calculate distance based on the speed of sound.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LectureTag type="Concept" label="13 μs Rule" content="In soft tissue, it takes 13 microseconds for sound to travel 1 cm and back. This is the cornerstone of range accuracy." />
          <LectureTag type="Tip" label="Total Distance" content="Remember that the total distance traveled is ALWAYS twice the depth (Go + Return). 1 cm depth = 2 cm total distance." />
          <LectureTag type="Not" label="Constant Speed" content="The machine ALWAYS assumes 1,540 m/s. If the speed is different (like in fat or bone), the dot will be placed at the wrong depth (Range Ambiguity Artifact)." />
        </div>

        <div className="premium-glass p-8 rounded-[2.5rem] border border-white/10 bg-registry-teal/5 relative overflow-hidden">
           <Timer className="absolute -right-8 -bottom-8 w-48 h-48 text-registry-teal opacity-10" />
           <h4 className="text-xl font-black uppercase italic mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-3 text-registry-teal" />
              The Math of Depth
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                 <p className="text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                    Depth (mm) = (1.54 mm/μs × Go-Return Time) / 2
                 </p>
                 <p className="text-xs text-slate-400">
                    To save time on the registry, just divide the total time by 13 to get the depth in centimeters! 
                 </p>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <ul className="space-y-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <li className="flex justify-between"><span>1 cm Depth</span> <span className="text-registry-teal">13 μs</span></li>
                    <li className="flex justify-between"><span>2 cm Depth</span> <span className="text-registry-teal">26 μs</span></li>
                    <li className="flex justify-between"><span>10 cm Depth</span> <span className="text-registry-teal">130 μs</span></li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    ),
    quiz: { 
      id: "q1.4", 
      type: "mcq", 
      question: "An echo returns to the transducer in 39 microseconds. At what depth is the reflector located?", 
      options: ["1 cm", "2 cm", "3 cm", "6 cm"], 
      correctAnswer: 2, 
      explanation: "Using the 13 microsecond rule: 39 μs / 13 μs per cm = 3 cm depth.", 
      visualContext: <PulseEchoVisual /> 
    }
  },
};
