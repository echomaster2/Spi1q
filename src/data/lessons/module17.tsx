import React from 'react';
import { 
  KnowledgeVisual,
  LectureTag
} from '../../../components/VisualElements';
import { LessonData } from '../../../types';

export const module17Lessons: Record<string, LessonData> = {
  "17.1": {
    title: "Metrics & Logs",
    narrationScript: "I've analyzed the most common math errors on the SPI exam to save you from 'dumb' mistakes. Today's roadmap: Part 1: The Metric System (Mega to Micro). Part 2: Working with Logarithms. Part 3: Scientific Notation. Part 4: The 'Holy Sh*t' Insight—How binary 1s and 0s define your dynamic range. Success in ultrasound physics is 50% physics and 50% unit conversion. If your system for math is 'just wing it,' you'll lose 10 points on simple decimals. Let's master the foundation. As promised, here is a little assessment.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Metric Prefixes" content="Giga (G) 10^9, Mega (M) 10^6, Kilo (k) 10^3, Centi (c) 10^-2, Milli (m) 10^-3, Micro (µ) 10^-6, Nano (n) 10^-9." />
            <LectureTag type="Def" label="Logarithms" content="Represent the number of 10s multiplied together to create a number. log(100) = 2. Essential for understanding Decibels (dB)." />
            <LectureTag type="Tip" label="Unit Consistency" content="Always ensure your units match before calculating! e.g., if velocity is in m/s, time must be in seconds." />
          </div>
          <div className="p-6 bg-slate-100 dark:bg-stealth-900 rounded-3xl border border-slate-200 dark:border-white/5">
            <h4 className="text-xl font-black uppercase italic text-registry-teal mb-4">The Metric Ladder</h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1"><span>Mega (M)</span> <span className="text-registry-teal">1,000,000</span></div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 py-1"><span>Kilo (k)</span> <span className="text-registry-teal">1,000</span></div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 py-1"><span>Base</span> <span className="text-slate-500">1</span></div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 py-1"><span>Milli (m)</span> <span className="text-registry-rose">0.001</span></div>
              <div className="flex justify-between py-1"><span>Micro (µ)</span> <span className="text-registry-rose">0.000001</span></div>
            </div>
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q17.1",
      type: "mcq",
      question: "How many centimeters are in 1 meter?",
      options: ["10", "100", "1,000", "0.01"],
      correctAnswer: 1,
      explanation: "There are 100 centimeters (cm) in 1 meter (m). Centi means hundredth."
    }
  },
  "17.2": {
    title: "Decibels (dB)",
    narrationScript: "I've spent weeks simplifying decibels so you don't have to dread them. Today's roadmap: Part 1: The logarithmic nature of dB. Part 2: Positive decibels (Amplification). Part 3: Negative decibels (Attenuation). Part 4: The 'Holy Sh*t' Insight—The rule of 3s and 10s. Decibels are not absolute values; they are comparisons. If your system for dB is 'subtraction,' you're doing it wrong; it's multiplication and division hidden as logs. As promised, here is a little assessment.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-100 dark:bg-stealth-900 rounded-3xl border border-slate-200 dark:border-white/5">
            <h4 className="text-xl font-black uppercase italic text-registry-teal mb-4">The 3dB & 10dB Rule</h4>
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
                <span className="font-black text-registry-teal">3dB increase</span> = Double the intensity (2x)
              </div>
              <div className="p-3 bg-registry-teal/20 rounded-xl border border-registry-teal/30 text-lg">
                <span className="font-black text-registry-teal">10dB increase</span> = 10x the intensity
              </div>
              <div className="p-3 bg-registry-rose/10 rounded-xl border border-registry-rose/20 mt-4">
                <span className="font-black text-registry-rose">-3dB decrease</span> = Half the intensity (1/2)
              </div>
              <div className="p-3 bg-registry-rose/20 rounded-xl border border-registry-rose/30">
                <span className="font-black text-registry-rose">-10dB decrease</span> = 1/10th the intensity
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Positive dB" content="Represents an increase in signal strength (Amplification). 20dB = 10x10 = 100x increase." />
            <LectureTag type="Not" label="Negative dB" content="Represents a decrease in signal strength (Attenuation). -20dB = 1/10 x 1/10 = 1/100th of original." />
            <LectureTag type="Tip" label="Comparison" content="Decibels always compare a NEW value to an OLD value. They are unit-less ratios!" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q17.2",
      type: "mcq",
      question: "If the signal intensity is increased by 30dB, how much larger has the signal become?",
      options: ["3 times larger", "30 times larger", "100 times larger", "1,000 times larger"],
      correctAnswer: 3,
      explanation: "An increase of 10dB is a 10-fold increase. For 30dB, we have three 10dB steps: 10 x 10 x 10 = 1,000."
    }
  }
};
