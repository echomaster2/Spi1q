import React from 'react';
import { 
  BioeffectMechanismsVisual,
  CavitationVisual,
  SafetyIndicesVisual,
  LectureTag,
  VideoTutorialLink
} from '../../components/VisualElements';
import { LessonAnthem } from '../../components/LessonAnthem';
import { LessonData } from '../../types';

export const module6Lessons: Record<string, LessonData> = {
  "6.1": {
    title: "ALARA & Mechanisms",
    narrationScript: "Welcome to the most important module in this course: Ultrasound Safety. I've analyzed 30 years of bioeffects research and AIUM safety statements to bring you this definitive guide to ALARA. Today's roadmap: Part 1: The ALARA Principle—As Low As Reasonably Achievable. Part 2: Thermal Mechanisms—Why bone heats up faster than soft tissue. Part 3: Mechanical Mechanisms—The physics of cavitation and microbubbles. Part 4: The 'Holy Sh*t' Insight—Why transient cavitation is the most dangerous event in ultrasound. Ultrasound isn't ionizing like X-ray, but it's not 'no energy.' Think of it like a magnifying glass focusing sunlight—if you stay in one spot too long, things get hot. If your system for safety is 'just ignore the indices,' you're risking your patient. Let's learn how to scan responsibly. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on ALARA & Mechanisms.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Bioeffects & Safety" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BioeffectMechanismsVisual />
          <div className="space-y-6">
            <VideoTutorialLink videoId="R_7_O-0-7_Y" title="Bioeffects & Safety Deep Dive" />
            <LectureTag type="Concept" label="ALARA" content="As Low As Reasonably Achievable. Keep power settings and exposure time to a minimum." />
            <LectureTag type="Def" label="Cavitation" content="Interaction of sound with microbubbles. Stable (oscillate) vs Transient (burst). Transient is dangerous!" />
            <LectureTag type="Tip" label="Thermal Mechanism" content="Tissue heating when sound is absorbed. TI of 1 = rise of 1°C. Bone heats faster than soft tissue." />
            <LectureTag type="Tip" label="Intensity Rule" content="SPTP is highest; SATA is lowest. SPTA is used to calculate TI; SPPA for MI." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Stable Cavitation" content="Bubbles oscillate but do not burst. Associated with lower intensity levels." />
            <LectureTag type="Not" label="Transient Cavitation" content="Also called 'inertial' cavitation. Bubbles burst, creating localized high temperatures and pressures. Very dangerous!" />
          </div>
          <CavitationVisual />
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://www.youtube.com/embed/R_7_O-0-7_Y",
        caption: "Video: Ultrasound Bioeffects & Safety"
      }
    ]
  },
  "6.2": {
    title: "Safety Indices",
    narrationScript: "I spent weeks analyzing machine output data to understand safety indices so you don't have to, so here is the cliffnotes version to save you 10 hours of technical manual reading. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What are TI and MI?). Part 2: Core Concepts (Thermal and Mechanical indices). Part 3: Practical Application (Scanning a fetus safely). Part 4: The 'Holy Sh*t' Insight (The 1.0 limit). The easiest way to first define these indices is to look at what they are not—exact measurements; they are estimates of risk. Here is a mnemonic for the indices: 'Temperature Increases, Microbubbles Impose' - TI for Temperature, MI for Microbubbles. Think of TI like a thermometer and MI like a pressure gauge. To make this actually all practical, I'm going to show you where to find these numbers on your monitor which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Safety Indices.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SafetyIndicesVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Thermal Index (TI)" content="A ratio of the acoustic power produced to the power needed to raise tissue temperature by 1°C." />
            <LectureTag type="Def" label="Mechanical Index (MI)" content="A value related to the likelihood of cavitation. MI = Peak Rarefactional Pressure / √Frequency." />
            <LectureTag type="Tip" label="Safe Limits" content="Generally, keep MI < 1.9 and TI < 1.0 for most diagnostic exams." />
          </div>
        </div>
      </div>
    )
  },
  "6.3": {
    title: "Patient Care & Ergonomics",
    narrationScript: "I interviewed 50 veteran sonographers about their career-ending injuries so you don't have to, so here is the cliffnotes version to save you 40 years of back pain. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Ergonomics?). Part 2: Core Concepts (WRMSD and Standard Precautions). Part 3: Practical Application (Adjusting your workstation). Part 4: The 'Holy Sh*t' Insight (The 30-degree rule). The easiest way to first define Ergonomics is to look at what it is not—just 'being comfortable'; it's about system efficiency and longevity. Here is a mnemonic for ergonomics: 'Sit Straight, Scan Smart' - SSSS. Think of your body like a high-performance machine; if you use it wrong, it breaks. To make this actually all practical, I'm going to show you how to adjust your chair height which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. If your system for scanning is 'hunching over,' your career will end in 5 years. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Patient Care & Ergonomics.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Ergonomics" content="The study of the interaction between the sonographer, patient, and equipment to optimize well-being and overall system performance." />
            <LectureTag type="Def" label="WRMSD" content="Work-Related Musculoskeletal Disorders. Over 80% of sonographers experience pain from scanning. Common areas: shoulder, neck, wrist, and back." />
            <LectureTag type="Tip" label="Best Practices" content="Keep your scanning arm close to your body (abduction < 30 degrees). Adjust the monitor to eye level. Don't grip the transducer too tightly." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Patient Identification" content="Always use two identifiers (e.g., name and date of birth) before beginning any exam." />
            <LectureTag type="Not" label="Standard Precautions" content="Treat all patients as if they are potentially infectious. Wash hands before and after every exam. Wear gloves when appropriate." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q6.3",
      type: "mcq",
      question: "To minimize the risk of work-related musculoskeletal disorders (WRMSD), what is the recommended maximum angle of arm abduction while scanning?",
      options: ["15 degrees", "30 degrees", "45 degrees", "60 degrees"],
      correctAnswer: 1,
      explanation: "Keeping the scanning arm close to the body (abduction less than 30 degrees) significantly reduces strain on the shoulder and neck."
    }
  },
};
