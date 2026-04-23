import React from 'react';
import { 
  DopplerShiftVisual,
  DopplerAngleExplainer,
  DopplerAngleVisual,
  DopplerModalitiesVisual,
  ColorDopplerVisual,
  SpectralDopplerVisual,
  ColorVarianceVisual,
  NyquistLimitVisual,
  AliasingVisual,
  KnowledgeVisual,
  LectureTag,
  VideoTutorialLink
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module4Lessons: Record<string, LessonData> = {
  "4.1": {
    title: "The Doppler Principle",
    narrationScript: "Welcome to the physics of motion. I've spent years analyzing vascular cases and reading the core Doppler papers so you don't have to. Today, we're mastering the Doppler Principle. Today's roadmap: Part 1: Definitions—What actually is the Doppler Effect? Part 2: The Doppler Equation—The variables you control vs. the ones you don't. Part 3: The 90-Degree Trap—Why blood flow can disappear in an instant. Part 4: The 'Holy Sh*t' Insight—The cosine effect and why 60 degrees is the magic number. Doppler isn't measuring speed; it's measuring a frequency shift. Think of it like an ambulance siren—the pitch changes based on direction and velocity. If your system for Doppler is 'just aim and shoot,' you'll miss critical pathology. Let's build a better system. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on The Doppler Principle.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <VideoTutorialLink videoId="TkjyyzsNpaU" title="Doppler Principles Deep Dive" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DopplerShiftVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Shift" content="The difference between the transmitted and received frequencies. Measured in Hz (audible range)." />
            <LectureTag type="Def" label="Demodulation" content="The process of extracting the low-frequency Doppler shift (Hz) from the high-frequency carrier wave (MHz)." />
            <LectureTag type="Tip" label="Registry Rule" content="Doppler shift is directly related to Velocity and Frequency, and inversely related to Propagation Speed." />
            <LectureTag type="Tip" label="Angle is Everything" content="Always aim for a 60-degree angle or less. 0 degrees is the greatest shift. 90 degrees = NO shift." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Equation" content="Shift = (2 × Velocity × Frequency × Cosine θ) / Propagation Speed." />
            <LectureTag type="Not" label="Cosine of 90°" content="At 90 degrees, the cosine is zero. This means you will see NO Doppler shift even if blood is moving fast!" />
            <div className="p-8 bg-slate-100 dark:bg-stealth-900 rounded-[2.5rem] border border-slate-200 dark:border-stealth-800">
               <h4 className="text-xl font-black uppercase italic mb-6">The Mnemonic</h4>
               <p className="text-sm font-bold uppercase tracking-tight text-registry-teal">"Two Crazy Foxes Velocity Cosine"</p>
               <p className="text-[10px] text-slate-500 mt-2">(2 x Frequency x Velocity x Cosine)</p>
            </div>
          </div>
          <div className="space-y-6">
            <DopplerAngleExplainer />
            <DopplerAngleVisual />
          </div>
        </div>
      </div>
    ),
    quiz: { id: "q4.1", type: "mcq", question: "What happens to the Doppler shift at a 90-degree angle?", options: ["It is maximum", "It is zero", "It is negative", "It is doubled"], correctAnswer: 1, explanation: "The cosine of 90 degrees is zero, so no Doppler shift is detected.", visualContext: <DopplerShiftVisual /> }
  },
  "4.2": {
    title: "Doppler Modalities",
    narrationScript: "I compared every Doppler mode on ten different machines to find the best settings for you, so here is the cliffnotes version to save you 30 hours of clinical rotation time. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are Doppler Modalities?). Part 2: Core Concepts (Color, Power, and Spectral). Part 3: Practical Application (Choosing the right mode). Part 4: The 'Holy Sh*t' Insight (The Nyquist Limit). The easiest way to first define these modes is to look at what they are not—Color is not quantitative, and Spectral is not a map. Here is a mnemonic for the modes: 'Cats Play Silly' - Color, Power, Spectral. Think of Color Doppler like a weather map showing the direction of the wind. To make this actually all practical, I'm going to show you how to adjust your color box which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Doppler Modalities.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Nyquist Limit" />
        <DopplerModalitiesVisual />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ColorDopplerVisual />
          <SpectralDopplerVisual />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Spectral Doppler: Carotid Artery" 
            description="Spectral Doppler waveform of the common carotid artery showing peak systolic and end diastolic velocities. The x-axis represents time and the y-axis represents velocity (or frequency shift)." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Carotid_ultrasound.jpg/800px-Carotid_ultrasound.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Color Doppler: Cardiac Flow" 
            description="Color Doppler in an apical 4-chamber view showing blood flow through the mitral and tricuspid valves. In standard color maps (BART), blue represents flow away from the transducer and red represents flow toward it." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Apical_four_chamber_view.jpg/800px-Apical_four_chamber_view.jpg"
            isDarkMode={true}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Aliasing" content="The most common artifact in Pulsed Doppler. Occurs when the Doppler shift exceeds the Nyquist limit (1/2 PRF)." />
            <LectureTag type="Def" label="Autocorrelation" content="The digital technique used to process Color Doppler (faster but less accurate than FFT)." />
            <LectureTag type="Tip" label="Fixing Aliasing" content="1. Increase Scale/PRF, 2. Lower Baseline, 3. Decrease Frequency, 4. Increase Doppler Angle." />
          </div>
          <ColorVarianceVisual />
        </div>
        <div className="mt-12">
          <NyquistLimitVisual />
        </div>
        <div className="mt-12 p-8 bg-slate-100 dark:bg-stealth-900 rounded-[2.5rem] border border-slate-200 dark:border-stealth-800">
             <h4 className="text-xl font-black uppercase italic mb-6">Doppler Comparison</h4>
             <ul className="space-y-2 text-sm font-bold uppercase tracking-tight text-slate-600 dark:text-stealth-400">
               <li><span className="text-registry-teal">Color:</span> Mean Velocity, Directional</li>
               <li><span className="text-registry-teal">Power:</span> Sensitivity, No Aliasing</li>
               <li><span className="text-registry-teal">Spectral:</span> Peak Velocity, Quantitative</li>
             </ul>
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Carotid_ultrasound.jpg/800px-Carotid_ultrasound.jpg",
        caption: "Color Doppler of the Carotid Artery - Showing flow direction and velocity estimates."
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Right_common_carotid_artery_normal_spectral_doppler.jpg/800px-Right_common_carotid_artery_normal_spectral_doppler.jpg",
        caption: "Spectral Doppler - Displaying peak systolic and end-diastolic velocities over time."
      }
    ],
    quiz: { id: "q4.2", type: "mcq", question: "Which Doppler mode is most sensitive to slow flow and independent of angle?", options: ["Color Doppler", "Spectral Doppler", "Power Doppler", "Continuous Wave Doppler"], correctAnswer: 2, explanation: "Power Doppler is highly sensitive to slow flow and does not depend on the Doppler angle.", visualContext: <DopplerModalitiesVisual /> }
  },
  "4.3": {
    title: "Doppler Artifacts",
    narrationScript: "If you can't distinguish between real flow and a Doppler artifact, you're scanning in the dark. I've troubleshot every possible Doppler error in the lab to give you this definitive guide. Today's roadmap: Part 1: Aliasing—The 'speed limit' of pulsed ultrasound. Part 2: Ghosting & Clutter—How to filter out the noise of moving tissue. Part 3: Crosstalk—The mirror image of the spectral world. Part 4: The 'Holy Sh*t' Insight—How to fix aliasing without changing your probe. Mnemonic: 'Scale Down Frequency' to fix aliasing. Think of aliasing like a fast-moving wheel appearing to spin backwards in a movie—it's a sampling error, not a physics error. Let's clean up your scans. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Doppler Artifacts.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <AliasingVisual />
        <KnowledgeVisual 
          title="Color Doppler Aliasing" 
          description="Color Doppler image showing aliasing. Notice the color wrapping from red to blue without passing through the black baseline, indicating the velocity exceeds the Nyquist limit." 
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/c/cc/ColourDopplerA.jpg"
          isDarkMode={true}
        />
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
      id: "q4.3",
      type: "mcq",
      question: "What is the Nyquist limit for a pulsed Doppler system with a PRF of 10,000 Hz?",
      options: ["5,000 Hz", "10,000 Hz", "20,000 Hz", "2,500 Hz"],
      correctAnswer: 0,
      explanation: "The Nyquist limit is always half of the Pulse Repetition Frequency (PRF/2). For a PRF of 10,000 Hz, the limit is 5,000 Hz."
    }
  },
};
