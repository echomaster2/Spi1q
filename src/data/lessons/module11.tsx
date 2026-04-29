import React from 'react';
import { Zap, Activity } from 'lucide-react';
import { 
  KnowledgeVisual,
  ScanConverterVisual,
  ReceiverPipelineVisual,
  PrePostProcessingVisual,
  TGCVisual,
  DynamicRangeVisual,
  DemodulationVisual,
  DisplayModesVisual,
  LectureTag
} from '../../components/VisualElements';
import { LessonAnthem } from '../../components/LessonAnthem';
import { LessonData } from '../../types';

export const module11Lessons: Record<string, LessonData> = {
  "11.1": {
    title: "System Components",
    narrationScript: "I spent 50 hours taking apart an ultrasound machine to understand its internal components so you don't have to, so here is the cliffnotes version to save you 30 hours of engineering manuals. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are the major system components?). Part 2: Core Concepts (The Pulser and Beam Former). Part 3: Practical Application (Coordinating the scan). Part 4: The 'Holy Sh*t' Insight (The Master Synchronizer). The easiest way to first define the Pulser is to look at what it is not—the Receiver; it's the engine that starts the pulse. Here is a mnemonic for system components: 'Please Bring My Super Scan' - Pulser, Beam former, Master synchronizer, Scan converter. Think of the Master Synchronizer like the conductor of an orchestra, making sure every instrument plays at the right time. To make this actually all practical, I'm going to show you how to adjust your output power which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on System Components.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <KnowledgeVisual 
          title="System Instrumentation" 
          description="The six major components of an ultrasound system: Master Synchronizer, Pulser, Transducer, Receiver, Memory, and Display." 
          imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Reflection_and_refraction.svg/800px-Reflection_and_refraction.svg.png"
          isDarkMode={true}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Pulser" content="Creates electrical signals that excite the transducer's PZT crystals. It determines the amplitude, PRP, and PRF." />
            <LectureTag type="Def" label="Beam Former" content="Determines the firing delay patterns for phased array systems. It controls steering and focusing." />
            <LectureTag type="Tip" label="Master Synchronizer" content="The 'brain' of the system. It coordinates all components to ensure they operate seamlessly together." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Scan Converter" content="Translates the information from the spoke format (scan lines) into the video format (horizontal lines)." />
            <LectureTag type="Def" label="Pixels & Bits" content="Pixel: The smallest building block of a digital picture. Bit: The smallest amount of computer memory. More bits per pixel = more shades of gray." />
          </div>
        </div>
        <div className="mt-12">
          <ScanConverterVisual />
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://www.youtube.com/embed/5D1gV37bKOU",
        caption: "Video: Knobology and Image Optimization"
      }
    ],
    quiz: { id: "q11.1", type: "mcq", question: "Which component of the ultrasound system is responsible for determining the PRF and PRP?", options: ["Transducer", "Pulser", "Receiver", "Scan Converter"], correctAnswer: 1, explanation: "The Pulser determines the Pulse Repetition Frequency (PRF), Pulse Repetition Period (PRP), and pulse amplitude.", visualContext: <ScanConverterVisual /> }
  },
  "11.2": {
    title: "Receiver Functions & Pipeline",
    narrationScript: `The receiver is where the weak echoes returning from the body are prepared for display. There are five specific functions that must happen in order: Amplification, Compensation, Compression, Demodulation, and Reject. 

I've broken down each step so you can understand which ones you control and which ones are fixed by the hardware. Holy Sh*t Insight: Demodulation is the only one you can't touch. It converts the radio frequency (RF) signal into a video signal your eyes can actually see.

To optimize your image, you must balance Gain and TGC first, then use Compression to manage the 'contrast' or grey-scale mapping of your image. As promised, here is a little assessment.`,
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="The Receiver Pipeline" />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ReceiverPipelineVisual />
          <div className="space-y-6 flex flex-col justify-center">
             <div className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                <h4 className="text-xl font-black uppercase italic tracking-tighter text-registry-teal">The ACCDRe Order</h4>
                <ol className="space-y-3 text-xs font-bold uppercase tracking-tight text-slate-400">
                   <li className="flex items-center space-x-3"><span className="w-6 h-6 rounded-full bg-registry-teal/20 flex items-center justify-center text-registry-teal text-[10px]">1</span> <span>Amplification (Overall Gain)</span></li>
                   <li className="flex items-center space-x-3"><span className="w-6 h-6 rounded-full bg-registry-teal/20 flex items-center justify-center text-registry-teal text-[10px]">2</span> <span>Compensation (TGC)</span></li>
                   <li className="flex items-center space-x-3"><span className="w-6 h-6 rounded-full bg-registry-teal/20 flex items-center justify-center text-registry-teal text-[10px]">3</span> <span>Compression (Dynamic Range)</span></li>
                   <li className="flex items-center space-x-3"><span className="w-6 h-6 rounded-full bg-registry-rose/20 flex items-center justify-center text-registry-rose text-[10px]">4</span> <span>Demodulation (Video conversion)</span></li>
                   <li className="flex items-center space-x-3"><span className="w-6 h-6 rounded-full bg-registry-teal/20 flex items-center justify-center text-registry-teal text-[10px]">5</span> <span>Reject (Thresholding)</span></li>
                </ol>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Amplification" content="Increases the strength of ALL returning signals. Does not improve signal-to-noise ratio." />
            <LectureTag type="Def" label="Compensation (TGC)" content="Creates an image that is uniformly bright from top to bottom. Offsets the effects of attenuation." />
            <LectureTag type="Tip" label="TGC Curve" content="The slope of the TGC curve is directly related to the transducer frequency and tissue attenuation." />
          </div>
          <TGCVisual />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Log Compression" content="Reduces the difference between the largest and smallest signals. This is necessary because our eyes have a limited dynamic range." />
            <LectureTag type="Not" label="Demodulation" content="Contains 2 steps: 1. Rectification (turning negative voltages into positive) and 2. Smoothing/Enveloping (wrapping the peaks). Fixed by manufacturer." />
            <LectureTag type="Tip" label="Dynamic Range" content="A ratio between the largest and smallest signals. Typically 100-120 dB at the receiver, but only 20-30 dB at the display." />
          </div>
          <div className="space-y-4">
            <DynamicRangeVisual />
            <DemodulationVisual />
          </div>
        </div>

        <div className="bg-stealth-800 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
           <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-registry-teal opacity-10" />
           <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Registry Rule: Gain vs Output Power</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="text-sm leading-relaxed opacity-80 italic">
                 When the image is too dark, always increase <strong>Receiver Gain</strong> first to minimize patient exposure (ALARA). Only increase Output Power if the image is still too dark after maximizing gain.
              </p>
              <div className="flex items-center justify-center bg-black/40 rounded-2xl p-6 border border-white/5">
                 <p className="font-mono text-[10px] text-registry-teal text-center uppercase tracking-widest leading-relaxed">
                    Dark Image? {"->"} Increase Gain <br/>
                    Bright Image? {"->"} Decrease Power
                 </p>
              </div>
           </div>
        </div>
      </div>
    ),
    quiz: { id: "q11.2", type: "mcq", question: "In what order are the receiver functions performed?", options: ["Compression, Compensation, Amplification, Reject, Demodulation", "Amplification, Compensation, Compression, Demodulation, Reject", "Demodulation, Compression, Compensation, Amplification, Reject", "Reject, Amplification, Compensation, Compression, Demodulation"], correctAnswer: 1, explanation: "The order is easy to remember as ACCDRe: Amplification, Compensation, Compression, Demodulation, and finally Reject.", visualContext: <ReceiverPipelineVisual /> }
  },
  "11.3": {
    title: "Display Modes & Magnification",
    narrationScript: `Ultrasound data is acquired as 'scan lines' but must be displayed as a 'video image'. This translation happens in the Scan Converter. 

In this lesson, we also dive into the difference between Read and Write magnification. Clinical Secret: Always use Write Magnification (Write Zoom) BEFORE you freeze the image to get more pixels and better resolution. Read magnification is just zooming in on a blurry photo.

Finally, we recap A-mode, B-mode, and M-mode. If you find yourself measuring fetal heart rates, M-mode is your best friend because of its incredible temporal resolution. Let's look at the visuals.`,
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <ScanConverterVisual />
           <div className="space-y-6 flex flex-col justify-center">
              <LectureTag type="Concept" label="Scan Converter" content="Stores and formats ultrasound data. It can be Analog (old) or Digital (modern/binary)." />
              <LectureTag type="Def" label="Binary Numbers" content="Digital systems use '0' and '1'. More bits per pixel = more shades of gray. 8 bits = 256 shades." />
              <LectureTag type="Tip" label="Spatial Resolution" content="Determined by pixel density. More pixels per inch = better detail." />
           </div>
        </div>

        <section className="premium-glass p-10 rounded-[3rem] border border-white/5 space-y-8 bg-registry-teal/5">
           <h4 className="text-2xl font-black uppercase italic tracking-tighter text-center">Write vs Read Zoom</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <div className="p-4 bg-registry-teal/20 rounded-xl w-fit">
                    <Zap className="w-5 h-5 text-registry-teal" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Write Magnification</h5>
                 <p className="text-[11px] text-slate-400 leading-relaxed">System rescans the ROI with MORE pixels. Pre-processing. Improves spatial resolution. Increases line density.</p>
                 <div className="h-1 w-full bg-registry-teal rounded-full" />
              </div>
              <div className="space-y-4 opacity-60">
                 <div className="p-4 bg-slate-500/20 rounded-xl w-fit">
                    <Activity className="w-5 h-5 text-slate-400" />
                 </div>
                 <h5 className="font-black uppercase text-sm">Read Magnification</h5>
                 <p className="text-[11px] text-slate-400 leading-relaxed">System enlarges existing pixels. Post-processing (after freeze). Spatial resolution is unchanged. Pixels get bigger/grainier.</p>
                 <div className="h-1 w-full bg-slate-500 rounded-full" />
              </div>
           </div>
        </section>

        <DisplayModesVisual />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="A-Mode (Amplitude Mode)" 
            description="Display showing spikes representing depth (x-axis) and strength (y-axis). High precision, zero dimensional. Used in Ophthalmology." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/A-scan_ultrasound_of_the_eye.jpg/800px-A-scan_ultrasound_of_the_eye.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="M-Mode (Motion Mode)" 
            description="Displays reflector position (y-axis) over time (x-axis). Highest sampling rate (Temporal Resolution). Perfect for valves and FHR." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitral_valve_M-mode.jpg/800px-Mitral_valve_M-mode.jpg"
            isDarkMode={true}
          />
        </div>

        <div className="flex flex-col items-center space-y-4 pt-8">
           <h4 className="text-xl font-black uppercase italic text-registry-teal tracking-widest">B-Mode Artifacts in Heart</h4>
           <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/Apikal4D.gif" alt="B-mode Echo" className="rounded-3xl border border-white/5 w-full max-w-xl shadow-2xl" referrerPolicy="no-referrer" />
           <p className="text-[10px] uppercase font-black text-slate-500">Real-time sampling at 30-60 frames per second</p>
        </div>
      </div>
    ),
    quiz: {
      id: "q11.3",
      type: "mcq",
      question: "Which ultrasound display mode is most useful for calculating the heart rate of a fetus?",
      options: ["A-mode", "B-mode", "M-mode", "3D-mode"],
      correctAnswer: 2,
      explanation: "M-mode (Motion mode) provides very high temporal resolution, allowing for precise tracking of movement over time. It is the gold standard for measuring rapid movements like the fetal heart rate or valve motion."
    }
  },
  "11.4": {
    title: "Image Processing",
    narrationScript: "I troubleshot every image processing setting to find the ones that actually improve resolution so you don't have to, so here is the cliffnotes version to save you 10 hours of post-processing experimentation. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (Pre- vs. Post-processing). Part 2: Core Concepts (Read vs. Write Magnification). Part 3: Practical Application (Zooming in on a small structure). Part 4: The 'Holy Sh*t' Insight (The Freeze Rule). The easiest way to first define these is to look at what they are not—Pre-processing is not undoable; Post-processing is. Here is a mnemonic for magnification: 'Write is Right' - Write magnification improves resolution. Think of Write magnification like taking a new, high-res photo, and Read magnification like zooming in on a blurry one. To make this actually all practical, I'm going to show you how to use Write Zoom for a carotid artery scan which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Image Processing.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Pre-processing" content="Manipulation of image data before storage in the scan converter. Examples: TGC, Write Magnification, Edge Enhancement, Spatial Compounding." />
            <LectureTag type="Def" label="Post-processing" content="Manipulation of image data after storage in the scan converter. Examples: Read Magnification, Black/White Inversion, Contrast Variation." />
            <LectureTag type="Tip" label="The Freeze Rule" content="If you can change it after you hit the 'Freeze' button, it's post-processing!" />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Write Magnification" content="Applied during data acquisition. The system rescans the region of interest, creating new scan lines and more pixels. Improves spatial resolution." />
            <LectureTag type="Def" label="Read Magnification" content="Applied after data acquisition. The system simply enlarges the existing pixels in the region of interest. Spatial resolution remains unchanged." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q11.4",
      type: "mcq",
      question: "Which of the following is considered a post-processing function?",
      options: ["Time Gain Compensation (TGC)", "Write Magnification", "Read Magnification", "Spatial Compounding"],
      correctAnswer: 2,
      explanation: "Read magnification is performed after the image data is stored in the scan converter memory, making it a post-processing function. TGC, write magnification, and spatial compounding are all pre-processing."
    }
  },
};
