import React from 'react';
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
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

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
    quiz: { id: "q11.1", type: "mcq", question: "Which component of the ultrasound system is responsible for determining the PRF and PRP?", options: ["Transducer", "Pulser", "Receiver", "Scan Converter"], correctAnswer: 1, explanation: "The Pulser determines the Pulse Repetition Frequency (PRF), Pulse Repetition Period (PRP), and pulse amplitude.", visualContext: <ScanConverterVisual /> }
  },
  "11.2": {
    title: "Receiver Functions",
    narrationScript: "I analyzed every step of the receiver pipeline to find the ones that actually change your image so you don't have to, so here is the cliffnotes version to save you 20 hours of signal processing study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are the 5 Receiver Functions?). Part 2: Core Concepts (ACCDRe order). Part 3: Practical Application (Optimizing your gain and TGC). Part 4: The 'Holy Sh*t' Insight (The Demodulation secret). The easiest way to first define these functions is to look at what they are not—Pre-processing; these happen in the receiver. Here is a mnemonic for the receiver order: 'ACCDRe' - Amplification, Compensation, Compression, Demodulation, Reject. Think of the receiver like a 'chef' preparing a meal; first you get the ingredients (amplification), then you season them (compensation), then you plate them (compression). To make this actually all practical, I'm going to show you how to set your TGC for a perfect liver scan which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Receiver Functions.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Amplitude & Layers" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Receiver Functions" 
            description="The five functions of the receiver: Amplification, Compensation, Compression, Demodulation, and Reject. These must be performed in this specific order." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Reflection_and_refraction.svg/800px-Reflection_and_refraction.svg.png"
            isDarkMode={true}
          />
          <ReceiverPipelineVisual />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Amplification (Gain)" content="Increases all signals equally. Adjusting gain only increases received info; it does NOT change transmitted sound (SAFE)." />
            <LectureTag type="Def" label="Compensation (TGC)" content="Corrects for attenuation by amplifying echoes from deeper structures more than shallow ones. Goal: Even brightness." />
            <LectureTag type="Tip" label="Receiver Order" content="ACCDRe: Amplification, Compensation, Compression, Demodulation, Reject." />
          </div>
          <PrePostProcessingVisual />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Compression" content="Reduces the range of signals to fit within the system's dynamic range. Operator adjustable." />
            <LectureTag type="Not" label="Demodulation" content="Converts RF signal to video signal via Rectification (negative to positive) and Enveloping (smoothing). NOT operator adjustable." />
          </div>
          <div className="space-y-4">
            <TGCVisual />
            <ScanConverterVisual />
            <DynamicRangeVisual />
            <DemodulationVisual />
          </div>
        </div>
      </div>
    ),
    quiz: { id: "q11.2", type: "mcq", question: "Which receiver function is NOT operator adjustable?", options: ["Amplification", "Compensation", "Demodulation", "Reject"], correctAnswer: 2, explanation: "Demodulation (Rectification and Smoothing) is performed automatically by the system and cannot be adjusted by the operator.", visualContext: <ReceiverPipelineVisual /> }
  },
  "11.3": {
    title: "Display Modes",
    narrationScript: "I spent weeks comparing every display mode to find their best clinical uses so you don't have to, so here is the cliffnotes version to save you 15 hours of diagnostic imaging study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are A, B, and M modes?). Part 2: Core Concepts (Amplitude, Brightness, and Motion). Part 3: Practical Application (Measuring heart valves). Part 4: The 'Holy Sh*t' Insight (Temporal resolution in M-mode). The easiest way to first define these modes is to look at what they are not—3D imaging; these are the 1D and 2D foundations. Here is a mnemonic for the modes: 'Always Be Moving' - A-mode, B-mode, M-mode. Think of A-mode like a skyline, B-mode like a photograph, and M-mode like a video of a single line. To make this actually all practical, I'm going to show you how to use M-mode to measure a fetal heart rate which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Display Modes.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <DisplayModesVisual />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="A-Mode (Amplitude Mode)" 
            description="Amplitude mode (A-mode) display showing spikes representing the depth and strength of echoes. The height of the spike represents the amplitude (strength) of the returning echo. Commonly used in ophthalmology for precise distance measurements." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/A-scan_ultrasound_of_the_eye.jpg/800px-A-scan_ultrasound_of_the_eye.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="M-Mode (Motion Mode)" 
            description="Motion mode (M-mode) showing the movement of reflectors over time. It has very high temporal resolution, making it ideal for tracking rapid motion like heart valves." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitral_valve_M-mode.jpg/800px-Mitral_valve_M-mode.jpg"
            isDarkMode={true}
          />
        </div>
        <div className="space-y-6">
          <LectureTag type="Concept" label="B-Mode (Brightness Mode)" content="The basis for all real-time 2D imaging. The brightness of the dot represents the strength of the echo." />
          <LectureTag type="Def" label="M-Mode (Motion Mode)" content="Shows the position of reflectors over time. Used extensively in cardiac imaging to measure valve motion." />
          <LectureTag type="Tip" label="A-Mode (Amplitude Mode)" content="Looks like a skyline. The height of the spikes represents the amplitude of the echoes. Used for precise distance measurements in ophthalmology." />
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">B-Mode Echocardiogram</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">A real-time B-mode (Brightness mode) echocardiogram showing the apical 4-chamber view of the heart.</p>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/Apikal4D.gif" alt="B-mode Echocardiogram" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">M-Mode Echocardiogram</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">An M-mode (Motion mode) tracing of the heart showing the movement of cardiac structures over time (x-axis). The y-axis represents depth.</p>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/PLAX_Mmode.jpg" alt="M-mode Echocardiogram" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-2xl" referrerPolicy="no-referrer" />
          </div>
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
