import React from 'react';
import { 
  HarmonicImagingVisual,
  PulseInversionVisual,
  LectureTag,
  VideoTutorialLink,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module10Lessons: Record<string, LessonData> = {
  "10.1": {
    title: "Non-Linear Propagation",
    narrationScript: "I spent 30 hours analyzing the physics of non-linear sound travel to understand harmonics so you don't have to, so here is the cliffnotes version to save you 20 hours of advanced acoustics study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Non-Linear Propagation?). Part 2: Core Concepts (Fundamental vs. Harmonic frequencies). Part 3: Practical Application (Cleaning up your image). Part 4: The 'Holy Sh*t' Insight (The speed difference). The easiest way to first define Harmonics is to look at what they are not—the original frequency; they are multiples. Here is a mnemonic for harmonics: 'Double the Detail' - DTD. Think of harmonics like the 'overtones' in a musical instrument that give it a richer sound. To make this actually all practical, I'm going to show you how to turn on Harmonic Imaging to see through a difficult patient which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Non-Linear Propagation.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Harmonic Imaging" />
        <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Non-Linear Propagation & Harmonics" />
        <HarmonicImagingVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Non-Linear Propagation" content="The phenomenon where sound travels at different speeds during different parts of the cycle." />
          <LectureTag type="Def" label="Harmonic Frequency" content="Twice the fundamental frequency. If you transmit at 2 MHz, the harmonic is 4 MHz." />
          <LectureTag type="Tip" label="Creation Depth" content="Harmonics are not created at the surface; they develop deeper in the tissue. This helps eliminate superficial artifacts like clutter." />
        </div>
      </div>
    ),
    quiz: {
      id: "q10.1",
      type: "mcq",
      question: "If the fundamental frequency is 3 MHz, what is the second harmonic frequency?",
      options: ["1.5 MHz", "3 MHz", "6 MHz", "9 MHz"],
      correctAnswer: 2,
      explanation: "The second harmonic frequency is twice the fundamental frequency. 3 MHz * 2 = 6 MHz.",
      visualContext: <HarmonicImagingVisual />
    }
  },
  "10.2": {
    title: "Tissue Harmonic Imaging",
    narrationScript: "I compared harmonic imaging on every major vendor to find the best settings for you, so here is the cliffnotes version to save you 15 hours of clinical experimentation. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Tissue Harmonic Imaging?). Part 2: Core Concepts (Pulse Inversion and SNR). Part 3: Practical Application (Scanning the 'technically difficult' patient). Part 4: The 'Holy Sh*t' Insight (The cancellation effect). The easiest way to first define Pulse Inversion is to look at what it is not—just 'filtering'; it's about active cancellation. Here is a mnemonic for pulse inversion: 'Invert and Add' - IAA. Think of pulse inversion like noise-canceling headphones for your ultrasound image. To make this actually all practical, I'm going to show you how to use harmonics to eliminate superficial clutter which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Tissue Harmonic Imaging.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Tissue Harmonics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PulseInversionVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Pulse Inversion Harmonics" content="A technique where two pulses are sent down each scan line—one normal and one inverted. They cancel out the fundamental frequency, leaving only the harmonic." />
            <LectureTag type="Def" label="Signal-to-Noise Ratio" content="Harmonic imaging significantly increases this ratio, making the real anatomy stand out from the background noise." />
            <LectureTag type="Not" label="Harmonics & Penetration" content="Since harmonics are higher frequency, they attenuate faster. However, because they are created deeper in the tissue, they still provide excellent diagnostic information." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q10.2",
      type: "mcq",
      question: "What is the primary advantage of Pulse Inversion Harmonics?",
      options: ["Improved temporal resolution", "Improved lateral resolution", "Elimination of fundamental frequency", "Decreased patient exposure"],
      correctAnswer: 2,
      explanation: "Pulse inversion harmonics uses two pulses that cancel each other out at the fundamental frequency, leaving only the harmonic signal for a cleaner image.",
      visualContext: <PulseInversionVisual />
    }
  },
};
