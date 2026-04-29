import React from 'react';
import { 
  ElastographyVisual,
  ContrastAgentVisual,
  PulseInversionVisual,
  LectureTag
} from '../../components/VisualElements';
import { LessonAnthem } from '../../components/LessonAnthem';
import { LessonData } from '../../types';

export const module12Lessons: Record<string, LessonData> = {
  "12.1": {
    title: "Elastography & Contrast",
    narrationScript: "I spent 40 hours analyzing the latest advanced imaging protocols so you don't have to, so here is the cliffnotes version to save you 30 hours of specialized clinical training. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are Elastography and Contrast?). Part 2: Core Concepts (Stiffness and Microbubbles). Part 3: Practical Application (Staging liver fibrosis). Part 4: The 'Holy Sh*t' Insight (Non-linear oscillation). The easiest way to first define Elastography is to look at what it is not—just B-mode imaging; it's about tissue stiffness. Here is a mnemonic for advanced tools: 'Bubbles and Bumps' - Contrast bubbles and Elastography bumps. Think of Elastography like 'virtual palpation' that lets you feel the hardness of a tumor without touching it. To make this actually all practical, I'm going to show you how to interpret a stiffness map which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Elastography & Contrast.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ElastographyVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Strain Elastography" content="Measures tissue deformation under pressure. Stiff tissues (like many cancers) deform less than soft, healthy tissues." />
            <LectureTag type="Def" label="Shear Wave Elastography" content="Uses a high-intensity pulse to create 'shear waves' that travel horizontally. The speed of these waves tells us the exact stiffness (Young's Modulus)." />
            <LectureTag type="Tip" label="Clinical Use" content="Commonly used for liver fibrosis staging and breast lesion characterization." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Contrast Agents" content="Microscopic gas bubbles (microbubbles) injected into the blood to increase reflectivity and show perfusion." />
            <LectureTag type="Not" label="Non-Linear Oscillation" content="Microbubbles expand more than they contract. This non-linear behavior creates strong harmonic signals." />
          </div>
          <ContrastAgentVisual />
        </div>
      </div>
    ),
    quiz: {
      id: "q12.1",
      type: "mcq",
      question: "Which type of elastography provides a quantitative measurement of tissue stiffness (in kPa or m/s)?",
      options: ["Strain Elastography", "Shear Wave Elastography", "A-Mode Elastography", "Harmonic Elastography"],
      correctAnswer: 1,
      explanation: "Shear Wave Elastography uses high-intensity pulses to generate shear waves; the speed of these waves is measured to provide a quantitative value of tissue stiffness."
    }
  },
  "12.2": {
    title: "Pulse Inversion",
    narrationScript: "I analyzed the signal processing of pulse inversion on ten different systems to find the best balance of resolution and speed so you don't have to, so here is the cliffnotes version to save you 20 hours of technical troubleshooting. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Pulse Inversion?). Part 2: Core Concepts (Destructive vs. Constructive Interference). Part 3: Practical Application (Cleaning up your image). Part 4: The 'Holy Sh*t' Insight (The frame rate trade-off). The easiest way to first define Pulse Inversion is to look at what it is not—standard filtering; it's active cancellation. Here is a mnemonic for the interference: 'Out of Phase, Erase' - Destructive interference cancels the fundamental. Think of pulse inversion like two waves meeting in the ocean; if they are perfectly opposite, they flatten out. To make this actually all practical, I'm going to show you how to manage your frame rate when using harmonics which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Pulse Inversion.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Sound Wave Symphony" />
        <div className="mt-12 space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-registry-teal">Deep Dive: Pulse Inversion Technology</h5>
            <div className="h-px flex-1 bg-slate-200 dark:bg-stealth-800" />
          </div>
          <PulseInversionVisual />
        </div>
        <div className="space-y-6">
          <LectureTag type="Concept" label="Destructive Interference" content="In Pulse Inversion, the fundamental frequencies of the two pulses are out of phase and cancel each other out." />
          <LectureTag type="Def" label="Constructive Interference" content="The harmonic frequencies are in phase and add together, creating a stronger signal for the image." />
          <LectureTag type="Tip" label="Frame Rate" content="Because two pulses are needed per scan line, the frame rate is halved, reducing temporal resolution." />
        </div>
      </div>
    ),
    quiz: {
      id: "q12.2",
      type: "mcq",
      question: "What is the primary trade-off when using Pulse Inversion Harmonic Imaging?",
      options: ["Reduced Axial Resolution", "Reduced Lateral Resolution", "Reduced Temporal Resolution", "Increased Artifacts"],
      correctAnswer: 2,
      explanation: "Pulse Inversion requires two pulses per scan line instead of one, which doubles the time needed to create a frame, thus halving the frame rate and reducing temporal resolution."
    }
  },
};
