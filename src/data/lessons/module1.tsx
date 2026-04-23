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
  LectureTag,
  KnowledgeVisual,
  VideoTutorialLink
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { Layers } from 'lucide-react';
import { LessonData } from '../../../types';

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
    narrationScript: "I spent weeks analyzing every SPI exam question on wave parameters so you don't have to, so here is the cliffnotes version to save you 40 hours of study time. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: The Big Seven Parameters. Part 2: What you can change vs what the system controls. Part 3: The practical application of frequency. Part 4: The 'Holy Sh*t' Insight about wavelength and resolution. The easiest way to first define these parameters is to look at what they are not—they are not independent. They are all linked. Here is a mnemonic in case you can't remember the big seven... just think about 'Pigs Powerfully Intimidate Farmers While Speeding Away' - Period, Power, Intensity, Frequency, Wavelength, Speed, Amplitude. Think of these parameters like a car trip. Speed is how fast you're driving, Frequency is how many trips you make, and Wavelength is the distance of each trip. To make this actually all practical, I'm going to show you how to adjust your power and gain settings which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. Engineer your knobology so you don't have to think about it. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Wave Parameters.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Frequency & Period" />
        <LessonAnthem stationName="Wavelength" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Wavelength (λ)" 
            description="The wavelength of a sound wave is the length of a wave and is defined as the distance of a complete cycle. It is expressed in mm. λ = c / f." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png"
            isDarkMode={true}
          />
          <WaveParametersVisual />
        </div>

        <LessonAnthem stationName="Propagation Speed" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Frequency" content="Number of cycles per second. Measured in Hertz (Hz). Diagnostic US: 2-20 MHz." />
            <LectureTag type="Def" label="Wavelength" content="The distance or length of one complete cycle. λ = c/f." />
            <LectureTag type="Tip" label="Inverse Relationship" content="Higher Frequency = Shorter Wavelength = Better Resolution but Less Penetration." />
            <LectureTag type="Tip" label="Registry Fact" content="Power, Intensity, and Amplitude describe wave strength. They are NOT related to frequency, wavelength, or period." />
          </div>
          <IntensityProfileVisual />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LessonAnthem stationName="Intensity" />
            <LessonAnthem stationName="Power & Area" />
            <LectureTag type="Concept" label="Amplitude & Power" content="The 'bigness' of the wave. Power is proportional to Amplitude squared." />
            <LectureTag type="Not" label="Intensity" content="Intensity is not just power; it's power divided by area. Focus the beam, and intensity skyrockets!" />
          </div>
          <div className="p-8 bg-slate-100 dark:bg-stealth-900 rounded-[2.5rem] border border-slate-200 dark:border-stealth-800">
             <h4 className="text-xl font-black uppercase italic mb-6">The Big Seven</h4>
             <ul className="space-y-2 text-sm font-bold uppercase tracking-tight text-slate-600 dark:text-stealth-400">
               <li>1. Period (T)</li>
               <li>2. Frequency (f)</li>
               <li>3. Amplitude (A)</li>
               <li>4. Power (P)</li>
               <li>5. Intensity (I)</li>
               <li>6. Wavelength (λ)</li>
               <li>7. Propagation Speed (c)</li>
             </ul>
          </div>
        </div>
      </div>
    ),
    quiz: { id: "q1.2", type: "mcq", question: "As frequency increases, what happens to the wavelength in a given medium?", options: ["Increases", "Decreases", "Stays the same", "Doubles"], correctAnswer: 1, explanation: "Wavelength and frequency are inversely proportional (λ = c/f). As frequency increases, wavelength decreases.", visualContext: <WaveParametersVisual /> }
  },
  "1.3": {
    title: "Interaction with Media",
    narrationScript: "I reviewed every single textbook chapter on acoustic interactions for you, condensing it here to save you 8 hours of reading. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Reflection and Refraction. Part 2: Scattering and Absorption. Part 3: Practical application in imaging. Part 4: The 'Holy Sh*t' Insight about acoustic impedance. The easiest way to first define Reflection is the given example of what is not Reflection—absorption, where the energy just turns into heat. Here is a mnemonic in case you can't remember the interactions... just think about 'Really Red Snakes Attack' - Reflection, Refraction, Scattering, Absorption. Think of sound hitting a boundary like throwing a tennis ball at a wall. If the wall is solid (high impedance difference), the ball bounces back perfectly. If the wall is a net, some goes through and some bounces. To make this actually all practical, I'm going to show you how to use ultrasound gel to match impedance which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. If your system includes 'forgetting the gel,' your image will be trash. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Interaction with Media.",
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
            <LectureTag type="Concept" label="Acoustic Impedance" content="The resistance to sound travel (Z = pc). Measured in Rayls. Only dependent on the medium." />
            <LectureTag type="Not" label="Refraction" content="Refraction requires two things: Oblique incidence AND different propagation speeds. Without both, no bending occurs (Snell's Law)." />
            <LectureTag type="Tip" label="Reflection Rule" content="Reflection = Impedance Mismatch. Soft tissue to air/lung interfaces produce the greatest energy reflection." />
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
};
