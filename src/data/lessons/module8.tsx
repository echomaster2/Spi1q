import React from 'react';
import { 
  QAPhantomVisual,
  DeadZoneVisual,
  LectureTag,
  VideoTutorialLink,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module8Lessons: Record<string, LessonData> = {
  "8.1": {
    title: "QA Principles",
    narrationScript: "I spent 60 hours performing quality assurance tests on every machine in the hospital so you don't have to, so here is the cliffnotes version to save you 40 hours of maintenance logs. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Quality Assurance?). Part 2: Core Concepts (Phantoms and the Dead Zone). Part 3: Practical Application (Testing your own equipment). Part 4: The 'Holy Sh*t' Insight (The legal necessity of QA). The easiest way to first define QA is to look at what it is not—just 'fixing things when they break'; it's about preventing failure. Here is a mnemonic for QA: 'Quality Always Matters' - QAM. Think of a phantom like a 'crash test dummy' for ultrasound; it lets you test the system without a real patient. To make this actually all practical, I'm going to show you how to measure your dead zone using a standoff pad which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. If your system for QA is 'non-existent,' your images will eventually lie to you. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on QA Principles.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Quality Assurance" />
        <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Quality Assurance & Phantoms" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QAPhantomVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Quality Assurance" content="Routine, periodic evaluation to maintain optimal image quality. Medically and legally necessary." />
            <LectureTag type="Def" label="Phantoms" content="AIUM 100mm (no attenuation, tests distance/accuracy). TEP (mimics soft tissue, tests grey-scale/resolution)." />
            <LectureTag type="Tip" label="Dead Zone" content="Space close to XDCR face that cannot detect echoes. First pin detected in TEP is the depth of the dead zone." />
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
    ),
    quiz: {
      id: "q8.1",
      type: "mcq",
      question: "Which of the following is used to evaluate the dead zone of an ultrasound system?",
      options: ["Doppler phantom", "Tissue equivalent phantom", "Slice thickness phantom", "Beam profile phantom"],
      correctAnswer: 1,
      explanation: "A tissue equivalent phantom (TEP) contains pins at various depths, including very shallow ones used to measure the dead zone.",
      visualContext: <DeadZoneVisual />
    }
  },
  "8.2": {
    title: "Phantoms & Testing",
    narrationScript: "I analyzed every type of ultrasound phantom on the market to understand their strengths and weaknesses so you don't have to, so here is the cliffnotes version to save you 20 hours of vendor catalog reading. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are the different Phantoms?). Part 2: Core Concepts (Tissue equivalence and Doppler testing). Part 3: Practical Application (Calibrating your machine). Part 4: The 'Holy Sh*t' Insight (Slice thickness resolution). The easiest way to first define these phantoms is to look at what they are not—human tissue; they are simulations. Here is a mnemonic for phantoms: 'Tissue Doppler Slice' - TDS. Think of a Doppler phantom like a 'fake heart' that pumps 'fake blood' to test your 'real machine.' To make this actually all practical, I'm going to show you how to perform a horizontal calibration check which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Phantoms & Testing.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Phantoms & Calibration" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Doppler Phantom" content="Contains a circulating fluid that mimics blood flow. Used to assess the accuracy of pulsed, continuous wave, and color Doppler systems." />
            <LectureTag type="Def" label="Slice Thickness Phantom" content="Evaluates elevational resolution. It contains a diffuse scattering plane that is at an angle to the incident sound beam." />
            <LectureTag type="Tip" label="Registration Accuracy" content="The ability of the system to place reflections in proper positions while imaging from different orientations." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Horizontal Calibration" content="The system's ability to place echoes in their correct position when the reflectors are perpendicular to the sound beam." />
            <LectureTag type="Def" label="Focal Zone" content="The depth at which the intensity is the highest and the beam is the narrowest. Lateral resolution is best here." />
          </div>
        </div>
        <div className="space-y-6 mt-8">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">Ultrasound Phantom Example</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">A typical ultrasound phantom used for quality assurance testing, containing various targets to evaluate resolution, penetration, and calibration.</p>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Imaging_phantom_as_seen_on_medical_ultrasound.jpg/800px-Imaging_phantom_as_seen_on_medical_ultrasound.jpg" alt="Ultrasound Phantom" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q8.2",
      type: "mcq",
      question: "What is the primary purpose of a Doppler phantom?",
      options: ["To test axial resolution", "To test lateral resolution", "To assess the accuracy of flow velocity measurements", "To measure the dead zone"],
      correctAnswer: 2,
      explanation: "Doppler phantoms use moving fluid or strings to simulate blood flow, allowing for the calibration and testing of Doppler velocity accuracy.",
      visualContext: <QAPhantomVisual />
    }
  },
};
