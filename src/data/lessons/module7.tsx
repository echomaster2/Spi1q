import { 
  StenosisHemodynamicsExplainer,
  FlowPatternsVisual,
  HemodynamicsPrinciplesVisual,
  LectureTag,
  VideoTutorialLink
} from '../../../components/VisualElements';
import { LessonData } from '../../../types';

export const module7Lessons: Record<string, LessonData> = {
  "7.1": {
    title: "Flow Patterns",
    narrationScript: "I spent 50 hours analyzing fluid dynamics and vascular flow patterns for you, so here is the cliffnotes version to save you 30 hours of hemodynamics study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Laminar vs. Turbulent flow?). Part 2: Core Concepts (The Bernoulli Effect and Stenosis). Part 3: Practical Application (Identifying high-risk blockages). Part 4: The 'Holy Sh*t' Insight (High velocity equals low pressure). The easiest way to first define Laminar flow is to look at what it is not—Turbulent flow, where everything is chaotic. Here is a mnemonic for flow: 'Layers are Laminar' - LAL. Think of blood flow like a multi-lane highway; in laminar flow, everyone stays in their lane. In turbulent flow, everyone is crashing. To make this actually all practical, I'm going to show you how to identify a stenosis by the flow pattern which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Flow Patterns.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <VideoTutorialLink videoId="-jhRhhA62Mo" title="Hemodynamics Deep Dive" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FlowPatternsVisual />
          <div className="space-y-6">
            <LectureTag type="Concept" label="Laminar Flow" content="Orderly flow in layers. Parabolic (highest in center) vs Plug (all layers same speed at origin)." />
            <LectureTag type="Def" label="Turbulent Flow" content="Disorganized flow with eddies/swirls. Reynolds Number > 2000 predicts turbulence (post-stenotic)." />
            <LectureTag type="Tip" label="Bernoulli Effect" content="Relationship between pressure and velocity. Hi Velocity = Low Pressure (at the stenosis)." />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Stenosis" content="A narrowing in a vessel. Velocity increases at the stenosis, and pressure drops—this is the Bernoulli Principle." />
            <LectureTag type="Not" label="Plug Flow" content="In plug flow, all layers move at the same velocity. This usually occurs at the entrance of large vessels like the aorta." />
          </div>
          <StenosisHemodynamicsExplainer />
        </div>
      </div>
    ),
    quiz: {
      id: "q7.1",
      type: "mcq",
      question: "At which location in a stenotic vessel is the pressure the lowest?",
      options: ["Proximal to the stenosis", "At the narrowest part of the stenosis", "In the post-stenotic turbulence zone", "Distal to the stenosis where flow normalizes"],
      correctAnswer: 1,
      explanation: "According to the Bernoulli Principle, velocity increases at the narrowing of a stenosis. To maintain the law of conservation of energy, this increase in kinetic energy results in a decrease in potential energy (pressure)."
    }
  },
  "7.2": {
    title: "Physical Principles",
    narrationScript: "I analyzed every major hemodynamic formula to find the ones that actually matter for your exam so you don't have to, so here is the cliffnotes version to save you 20 hours of physics math. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is the Bernoulli Principle?). Part 2: Core Concepts (Poiseuille's Law and Hydrostatic Pressure). Part 3: Practical Application (Understanding pressure changes). Part 4: The 'Holy Sh*t' Insight (The power of the radius). The easiest way to first define these principles is to look at what they are not—static fluid rules; these are for moving blood. Here is a mnemonic for Poiseuille's Law: 'Radius Rules Resistance' - RRR. Think of a vessel like a garden hose; if you kink it or shrink it, the resistance skyrockets. To make this actually all practical, I'm going to show you how to calculate hydrostatic pressure based on patient position which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Physical Principles.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <HemodynamicsPrinciplesVisual />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Bernoulli Principle" content="Describes the relationship between velocity and pressure. High velocity = Low pressure." />
          <LectureTag type="Def" label="Poiseuille's Law" content="Describes the relationship between pressure, flow, and resistance. Resistance is highly sensitive to vessel radius (Radius to the 4th power!)." />
          <LectureTag type="Tip" label="Hydrostatic Pressure" content="The weight of blood pressing against the vessel walls. It changes with the patient's position relative to the heart." />
        </div>
        <div className="space-y-6 mt-8">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">Bernoulli's Principle in Action</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">As fluid passes through a narrowing (stenosis), its velocity increases to maintain flow, resulting in a corresponding decrease in pressure at the stenosis.</p>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/VenturiFlow.png/800px-VenturiFlow.png" alt="Bernoulli Principle" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-2xl bg-white" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q7.2",
      type: "mcq",
      question: "If the radius of a vessel is reduced by half, what happens to the resistance to flow, according to Poiseuille's Law?",
      options: ["Resistance doubles", "Resistance increases 4-fold", "Resistance increases 8-fold", "Resistance increases 16-fold"],
      correctAnswer: 3,
      explanation: "Poiseuille's Law states that resistance is inversely proportional to the radius to the 4th power (r^4). If the radius is halved (1/2), the resistance increases by (2^4), which is 16 times."
    }
  },
  "7.3": {
    title: "Venous Hemodynamics",
    narrationScript: "I spent weeks studying the venous system's response to breathing so you don't have to, so here is the cliffnotes version to save you 15 hours of physiology reading. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is Venous Phasicity?). Part 2: Core Concepts (Respiration and Hydrostatic Pressure). Part 3: Practical Application (DVT screening). Part 4: The 'Holy Sh*t' Insight (The diaphragm as a pump). The easiest way to first define Venous flow is to look at what it is not—Arterial flow; it's low pressure and phasic. Here is a mnemonic for respiration: 'Inhale, Leg flow Low' - ILL. Think of the diaphragm like a piston in an engine; when it moves down, it changes the pressure in the whole system. To make this actually all practical, I'm going to show you how to perform a Valsalva maneuver to check for venous reflux which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Venous Hemodynamics.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="space-y-6">
          <LectureTag type="Concept" label="Phasicity" content="Venous flow moved by respiration. Inhalation: ↑ Abdominal pressure, ↓ Leg flow. Exhalation: ↓ Abdominal pressure, ↑ Leg flow." />
          <LectureTag type="Def" label="Hydrostatic Pressure" content="Weight of blood column. Supine: 0 mmHg. Standing: 100 mmHg at ankle. Hand raised: -50 mmHg." />
          <LectureTag type="Tip" label="Valsalva Maneuver" content="Stops ALL venous flow because it increases both chest and abdominal pressures." />
        </div>
        <div className="space-y-6">
          <LectureTag type="Concept" label="Transmural Pressure" content="The difference between the pressure inside the vein and the pressure outside the vein. Determines the cross-sectional shape of the vein (from dumbbell to circular)." />
          <LectureTag type="Not" label="Venous Valves" content="Valves prevent retrograde (backward) flow. They are crucial for maintaining unidirectional flow toward the heart, especially against gravity." />
        </div>
      </div>
    ),
    quiz: {
      id: "q7.3",
      type: "mcq",
      question: "What happens to venous return from the lower extremities during inspiration?",
      options: ["It increases", "It decreases", "It stops completely", "It remains unchanged"],
      correctAnswer: 1,
      explanation: "During inspiration, the diaphragm moves downward, increasing intra-abdominal pressure. This higher pressure impedes venous return from the legs, causing flow to decrease."
    }
  },
};
