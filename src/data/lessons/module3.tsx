import React from 'react';
import { 
  PulseEchoPrincipleVisual,
  DutyFactorVisual,
  LectureTag,
  VideoTutorialLink,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module3Lessons: Record<string, LessonData> = {
  "3.1": {
    title: "Pulse-Echo Principle",
    narrationScript: "Welcome to the physics of timing. I've spent weeks calculating round-trip times for every possible tissue depth to bring you this definitive guide to the Pulse-Echo Principle. Today's roadmap: Part 1: The Pulse-Echo Principle—How we locate objects in 3D space. Part 2: The Range Equation—The math behind the image. Part 3: The '13 Microsecond Rule'—The most important number in ultrasound physics. Part 4: The 'Holy Sh*t' Insight—Why your machine spends 99% of its time doing absolutely nothing. Think of the ultrasound machine like a bat using echolocation. It sends a 'chirp' and then waits—listening intently for the echo to return. Mnemonic: 'Lucky 13' - 13 microseconds per centimeter of depth. If your system for measuring is 'eyeballing it,' you'll miss critical findings. Let's master the math of the echo. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on the Pulse-Echo Principle.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Pulse-Echo Principle" />
        <VideoTutorialLink videoId="xtdfCGz6e1Y" title="Pulse-Echo & Range Equation" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PulseEchoPrincipleVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Range Equation" content="Distance = (Propagation Speed × Round Trip Time) / 2." />
            <LectureTag type="Def" label="13 µs Rule" content="In soft tissue, it takes 13 microseconds for sound to travel 1 cm deep and return (2 cm total travel)." />
            <LectureTag type="Tip" label="Depth Calculation" content="If the time-of-flight is 39 µs, the object is 3 cm deep. (39 / 13 = 3)." />
          </div>
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ultrasound_liver_right_lobe_and_right_kidney.jpg/800px-Ultrasound_liver_right_lobe_and_right_kidney.jpg",
        caption: "Liver and Kidney Interface - Demonstrating depth perception and the pulse-echo principle in action."
      }
    ],
    quiz: {
      id: "q3.1",
      type: "mcq",
      question: "If a reflector is 5 cm deep in soft tissue, what is the total time-of-flight?",
      options: ["13 µs", "39 µs", "65 µs", "130 µs"],
      correctAnswer: 2,
      explanation: "Using the 13 µs rule: 13 µs per cm of depth. 5 cm * 13 µs/cm = 65 µs.",
      visualContext: <PulseEchoPrincipleVisual />
    }
  },
  "3.2": {
    title: "Pulsed Wave Parameters",
    narrationScript: "I analyzed thousands of pulse sequences to understand the timing of ultrasound so you don't have to, so here is the cliffnotes version to save you 25 hours of signal processing theory. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are Pulsed Parameters?). Part 2: Core Concepts (PRF, PRP, and Duty Factor). Part 3: Practical Application (Optimizing your frame rate). Part 4: The 'Holy Sh*t' Insight (The system is silent 99% of the time). The easiest way to first define Pulsed Wave parameters is to look at what they are not—continuous wave parameters like frequency and period. Here is a mnemonic for the pulsed parameters: 'Please Read Pretty Soon' - PRF, PRP, SPL. Think of the Duty Factor like a part-time job; the machine only 'works' for a tiny fraction of the time and spends the rest 'listening.' To make this actually all practical, I'm going to show you how to adjust your depth to increase your frame rate which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Pulsed Wave Parameters.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Pulsed Wave Parameters" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Pulse Repetition Frequency (PRF)" content="The number of pulses that an ultrasound system transmits into the body each second. It is determined by maximum imaging depth." />
            <LectureTag type="Def" label="Pulse Repetition Period (PRP)" content="The time from the start of one pulse to the start of the next pulse. It includes one pulse duration plus one listening time." />
            <LectureTag type="Tip" label="Depth Relationship" content="As depth of view increases, PRP increases and PRF decreases. They are inversely related." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Spatial Pulse Length (SPL)" content="The distance that a pulse occupies in space from the start to the end of a pulse. SPL = # of cycles × wavelength." />
            <LectureTag type="Def" label="Duty Factor" content="The percentage or fraction of time that the system transmits a pulse. Duty Factor = (Pulse Duration / PRP) × 100." />
            <LectureTag type="Tip" label="Clinical Values" content="In clinical imaging, duty factor ranges from 0.2% to 0.5%. The system spends 99% of its time listening!" />
          </div>
        </div>
        <DutyFactorVisual />
      </div>
    ),
    quiz: {
      id: "q3.2",
      type: "mcq",
      question: "Which of the following will increase the Duty Factor?",
      options: ["Increasing the depth", "Decreasing the depth", "Increasing the frequency", "Decreasing the amplitude"],
      correctAnswer: 1,
      explanation: "Decreasing the depth decreases the PRP (less listening time), which increases the percentage of time the system is transmitting (Duty Factor).",
      visualContext: <DutyFactorVisual />
    }
  },
};
