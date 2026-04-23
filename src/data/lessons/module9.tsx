import React from 'react';
import { 
  DampingResolutionExplainer,
  ResolutionComparison,
  TemporalResolutionVisual,
  LectureTag,
  VideoTutorialLink,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module9Lessons: Record<string, LessonData> = {
  "9.1": {
    title: "Axial Resolution",
    narrationScript: "I spent 40 hours analyzing pulse lengths and damping materials to understand axial resolution so you don't have to, so here is the cliffnotes version to save you 30 hours of physics study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Axial Resolution?). Part 2: Core Concepts (SPL and Damping). Part 3: Practical Application (Improving image detail). Part 4: The 'Holy Sh*t' Insight (The LARRD mnemonic). The easiest way to first define Axial Resolution is to look at what it is not—Lateral Resolution; it's about seeing things one in front of the other. Here is a mnemonic for axial resolution: 'LARRD' - Longitudinal, Axial, Range, Radial, Depth. Think of a pulse like a 'measuring stick'; the shorter the stick, the smaller the things you can measure. To make this actually all practical, I'm going to show you how to increase your frequency to sharpen your image which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Axial Resolution.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Axial Resolution" />
        <VideoTutorialLink videoId="3oVf0r51Fzw" title="Resolution & Damping" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResolutionComparison />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Axial Resolution" content="The ability to distinguish two structures parallel to the sound beam. Axial = 1/2 SPL." />
            <LectureTag type="Def" label="Spatial Pulse Length (SPL)" content="The distance from the start to the end of a pulse. SPL = # cycles × wavelength." />
            <LectureTag type="Tip" label="LARRD Mnemonic" content="Longitudinal, Axial, Range, Radial, Depth. All refer to axial resolution." />
            <LectureTag type="Tip" label="Resolution Goal" content="To improve axial resolution, shorten the pulse by increasing frequency or adding damping material." />
          </div>
        </div>
        <div className="clinical-card p-8">
          <h4 className="text-xl font-black uppercase italic mb-6">Damping & Resolution</h4>
          <DampingResolutionExplainer />
          <LectureTag type="Not" label="Frequency & Axial" content="Higher frequency improves axial resolution because it creates shorter pulses. It does NOT improve lateral resolution in the far field." />
        </div>
      </div>
    ),
    quiz: {
      id: "q9.1",
      type: "mcq",
      question: "If the spatial pulse length is 4 mm, what is the axial resolution?",
      options: ["4 mm", "2 mm", "8 mm", "1 mm"],
      correctAnswer: 1,
      explanation: "Axial resolution is equal to half the spatial pulse length (SPL/2). 4 mm / 2 = 2 mm.",
      visualContext: <ResolutionComparison />
    }
  },
  "9.2": {
    title: "Lateral Resolution",
    narrationScript: "I analyzed every beam-focusing technique to find the ones that actually improve lateral resolution so you don't have to, so here is the cliffnotes version to save you 25 hours of transducer physics. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Lateral Resolution?). Part 2: Core Concepts (Beam Width and Focusing). Part 3: Practical Application (Seeing things side-by-side). Part 4: The 'Holy Sh*t' Insight (The LATA mnemonic). The easiest way to first define Lateral Resolution is to look at what it is not—Axial Resolution; it's about beam width. Here is a mnemonic for lateral resolution: 'LATA' - Lateral, Angular, Transverse, Azimuthal. Think of the beam like a flashlight; the tighter the beam, the more detail you see. To make this actually all practical, I'm going to show you how to move your focal zone to the area of interest which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Lateral Resolution.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Lateral Resolution" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResolutionComparison />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Lateral Resolution" content="The ability to distinguish two structures perpendicular to the sound beam. Lateral = Beam Width." />
            <LectureTag type="Def" label="Beam Width" content="Lateral resolution is equal to the beam diameter. Narrower is better." />
            <LectureTag type="Tip" label="LATA Mnemonic" content="Lateral, Angular, Transverse, Azimuthal. All refer to lateral resolution." />
            <LectureTag type="Tip" label="Resolution Goal" content="To improve lateral resolution, narrow the beam by focusing or increasing line density." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Temporal Resolution" content="The ability to see moving structures in real-time. Determined by frame rate." />
            <LectureTag type="Not" label="Lateral vs Depth" content="Lateral resolution changes with depth because the beam width changes. It is best at the focus." />
          </div>
          <TemporalResolutionVisual />
        </div>
      </div>
    ),
    quiz: {
      id: "q9.2",
      type: "mcq",
      question: "At which location is lateral resolution the best?",
      options: ["At the transducer face", "At the focal point", "In the far zone", "At two near zone lengths"],
      correctAnswer: 1,
      explanation: "Lateral resolution is determined by beam width. The beam is narrowest at the focal point, so lateral resolution is best there.",
      visualContext: <ResolutionComparison />
    }
  },
  "9.3": {
    title: "Elevational Resolution",
    narrationScript: "I spent weeks studying the 'forgotten dimension' of ultrasound resolution so you don't have to, so here is the cliffnotes version to save you 15 hours of advanced imaging study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Elevational Resolution?). Part 2: Core Concepts (Slice Thickness and 1.5D Arrays). Part 3: Practical Application (Avoiding partial volume artifacts). Part 4: The 'Holy Sh*t' Insight (The 3D beam). The easiest way to first define Elevational Resolution is to look at what it is not—just 2D resolution; it's the thickness of the slice. Here is a mnemonic for elevational resolution: 'Slice is Secret' - SIS. Think of the ultrasound beam like a knife; if the knife is too thick, you can't cut thin slices. To make this actually all practical, I'm going to show you how to use a 1.5D array probe to improve your slice thickness which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Elevational Resolution.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Elevational Resolution" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Elevational Resolution" content="The ability to distinguish structures in the axis perpendicular to the imaging plane (slice thickness)." />
            <LectureTag type="Def" label="Partial Volume Artifact" content="Occurs when the slice thickness is wider than the structure being imaged, causing surrounding tissue to be averaged into the image." />
            <LectureTag type="Tip" label="1.5D Arrays" content="These transducers have multiple rows of elements, allowing them to focus the beam in the elevational plane and improve slice thickness." />
          </div>
          <div className="space-y-6">
            <LectureTag type="Concept" label="Mechanical Focusing" content="In older or simpler probes, a curved lens is used to mechanically focus the beam in the elevational plane." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q9.3",
      type: "mcq",
      question: "What type of transducer can improve elevational resolution through electronic focusing?",
      options: ["Linear array", "Phased array", "1.5D array", "Curvilinear array"],
      correctAnswer: 2,
      explanation: "1.5D arrays have multiple rows of elements, which allows for electronic focusing in the elevational (slice-thickness) plane.",
      visualContext: <TemporalResolutionVisual />
    }
  },
};
