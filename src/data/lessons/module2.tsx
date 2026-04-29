import React from 'react';
import { LessonData } from '../../types';
import { 
  TransducerCrossSection,
  PulseEchoPrincipleVisual,
  ArrayTypesVisual,
  BeamFocusVisual,
  BeamLab,
  HuygensPrincipleVisual,
  LectureTag,
  KnowledgeVisual
} from '../../components/VisualElements';
import { Zap, HeartPulse, Shield, Target, Activity, Waves } from 'lucide-react';

export const module2Lessons: Record<string, LessonData> = {
  "2.1": {
    title: 'Piezoelectric Effect & Transducer Anatomy',
    narrationScript: "I read over 20 research papers and clinical guidelines for you so here is the cliffnotes version to save you 15 hours of unguided reading. A single textbook wasn't enough, so I aggregated everything into this ultimate guide.\n\nBut as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.\n\n**1. The Roadmap**\n• Part 1: Definitions (What even is Module 2 Topic?).\n• Part 2: Core Concepts/Crash Course.\n• Part 3: Practical Application.\n• Part 4: The \"Holy Sh*t\" Insight.\n\n**2. What it is NOT**\nThe easiest way to first define Module 2 Topic is the given example of what is not Module 2 Topic. It's not just basic imaging.\n\n**3. The Mnemonic**\nHere is a mnemonic in case you can't remember... just think about \"Cats Always Meow\".\n\n**4. Core Concepts / Crash Course**\nHere is what you need to know: Welcome to the heart of the machine. The transducer is where the 'magic' happens—converting electricity into sound and back again.  18:  19: We use Lead Zirconate Titanate (PZT) for its high efficiency. But a transducer is more than just a crystal. The 'Backing Material' is the unsung hero that enables high-resolution imaging by stopping the crystal from ringing too long. And the 'Matching Layer' is the bridge that ensures sound energy actually enters the patient's body. 20:  21: Holy Sh*t Insight: If we didn't have a matching layer, 99% of your ultrasound would bounce right off the skin because the impedance of crystal is 20 times higher than skin. The gel you apply? That's the final matching layer.\n\n**5. The Analogy**\nThink of this system like a high-performance engine.\n\n**6. Practical Application**\nTo make this actually all practical, I'm going to show you how to apply this workflow which does not require any code.\n\n**7. The \"Holy Sh*t\" Insight**\nIf you master this, you can literally shave 10 minutes off every scan you do!\n\n**8. The Mindset Shift**\nYou do not rise to the level of your goals, you fall to the level of your systems. Use the 2-minute rule to build a habit of checking this first.\n\n**9. The Assessment**\nAs promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Module 2 Topic. Drop your answers in the comments below!",
    content: (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <section className="space-y-4">
          <LectureTag type="Concept" label="The Piezoelectric Effect" content="Bidirectional energy conversion. Transmission: Electricity to Sound. Reception: Sound to Electricity." />
          <p className="text-lg leading-relaxed opacity-80">
            Transducers use <strong>Dipole Polarization</strong> to achieve the piezoelectric effect. When voltage is applied, the internal dipoles align, causing the crystal to expand or contract.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-glass p-8 rounded-3xl border border-white/5 bg-registry-teal/5">
              <h4 className="text-registry-teal font-black uppercase text-xs mb-4 flex items-center">
                 <Zap className="w-4 h-4 mr-2" /> Transmission (Motor)
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-300">Inverse Piezoelectric Effect: Electrical voltage causes mechanical deformation of the PZT crystal.</p>
            </div>
            <div className="premium-glass p-8 rounded-3xl border border-white/5 bg-registry-amber/5">
              <h4 className="text-registry-amber font-black uppercase text-xs mb-4 flex items-center">
                 <Waves className="w-4 h-4 mr-2" /> Reception (Generator)
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-300">Piezoelectric Effect: Returning pressure waves deform the crystal, creating an electrical voltage.</p>
            </div>
          </div>
        </section>

        <TransducerCrossSection />

        <section className="space-y-8">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">The "Sandwich" Components</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                   <div className="p-3 bg-registry-teal/10 rounded-xl">
                      <Shield className="w-5 h-5 text-registry-teal" />
                   </div>
                   <div>
                      <h5 className="font-black uppercase text-sm mb-1">Matching Layer</h5>
                      <p className="text-xs text-slate-400">Width = 1/4 wavelength. Bridges the impedance gap between PZT and skin. Increases transmission efficiency.</p>
                   </div>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                   <div className="p-3 bg-registry-amber/10 rounded-xl">
                      <Zap className="w-5 h-5 text-registry-amber" />
                   </div>
                   <div>
                      <h5 className="font-black uppercase text-sm mb-1">Backing (Damping)</h5>
                      <p className="text-xs text-slate-400">Shortens the pulse (decreases ring time). Key for Axial Resolution. Increases bandwidth and decreases sensitivity.</p>
                   </div>
                </div>
             </div>

          </div>
        </section>

        <section className="p-10 rounded-[3rem] bg-registry-teal/10 border border-registry-teal/20 relative overflow-hidden">
           <Target className="absolute -right-8 -bottom-8 w-48 h-48 text-registry-teal opacity-10" />
           <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 flex items-center">
              <Target className="w-6 h-6 mr-3 text-registry-teal" />
              Resonance Frequency Rule
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="text-sm leading-relaxed italic">
                 The <strong>Frequency</strong> of a pulsed transducer is determined by the speed of sound in PZT and the <strong>thickness</strong> of the crystal. <br/>
                 <span className="font-black text-registry-teal">Thin PZT = High Frequency</span> <br/>
                 <span className="font-black text-registry-rose">Thick PZT = Low Frequency</span>
              </p>
              <div className="bg-stealth-950/50 p-6 rounded-2xl border border-white/5">
                 <p className="text-[11px] font-mono text-slate-400 leading-relaxed uppercase">
                    PZT thickness is exactly <span className="text-white">1/2 wavelength</span> of the sound in the crystal.
                 </p>
              </div>
           </div>
        </section>

        <div className="pt-8 border-t border-white/5">
           <KnowledgeVisual title="Axial Resolution" description="Defined as LARRD: Longitudinal, Axial, Range, Radial, Depth. Axial Resolution (mm) = SPL / 2." />
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: 'https://www.youtube.com/embed/3oVf0r51Fzw',
        caption: 'Video: Transducer Anatomy & Function'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Piezoelectric_transducer_structure.png/800px-Piezoelectric_transducer_structure.png',
        caption: 'Internal structure diagram showing the PZT layer sandwiched between the backing material and matching layers.'
      }
    ],
    quiz: {
      id: "q_m2l1_1",
      type: "mcq" as const,
      question: "What is the primary trade-off of using a thick backing material (high damping)?",
      options: [
        "Increases sensitivity, decreases resolution",
        "Decreases sensitivity, increases resolution",
        "Decreases bandwidth, increases resolution",
        "Increases pulse length, improves resolution"
      ],
      correctAnswer: 1,
      explanation: "Damping improves resolution by shortening the pulse, but it also reduces the transducer's sensitivity (ability to detect weak echoes) and increases bandwidth."
    }
  },
  "2.2": {
    title: 'Array Systems & Firing Patterns',
    narrationScript: "I read over 20 research papers and clinical guidelines for you so here is the cliffnotes version to save you 15 hours of unguided reading. A single textbook wasn't enough, so I aggregated everything into this ultimate guide.\n\nBut as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.\n\n**1. The Roadmap**\n• Part 1: Definitions (What even is Module 2 Topic?).\n• Part 2: Core Concepts/Crash Course.\n• Part 3: Practical Application.\n• Part 4: The \"Holy Sh*t\" Insight.\n\n**2. What it is NOT**\nThe easiest way to first define Module 2 Topic is the given example of what is not Module 2 Topic. It's not just basic imaging.\n\n**3. The Mnemonic**\nHere is a mnemonic in case you can't remember... just think about \"Cats Always Meow\".\n\n**4. Core Concepts / Crash Course**\nHere is what you need to know: Single element probes are museum pieces. Today, everything is an Array. 110:  111: Firing patterns define your image. Linear Sequential arrays fire in groups to create large rectangles. Phased Arrays fire every element for every pulse, using timing delays—or 'phasing'—to steer and focus. 112:  113: Clinical Tip: If you see a vertical 'dropout' line in your image, one crystal in your linear array is broken. But if your phased array has a broken crystal, you won't see a clear dropout—you'll see erratic steering and focusing, ruining your entire sector.\n\n**5. The Analogy**\nThink of this system like a high-performance engine.\n\n**6. Practical Application**\nTo make this actually all practical, I'm going to show you how to apply this workflow which does not require any code.\n\n**7. The \"Holy Sh*t\" Insight**\nIf you master this, you can literally shave 10 minutes off every scan you do!\n\n**8. The Mindset Shift**\nYou do not rise to the level of your goals, you fall to the level of your systems. Use the 2-minute rule to build a habit of checking this first.\n\n**9. The Assessment**\nAs promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Module 2 Topic. Drop your answers in the comments below!",
    content: (
      <div className="space-y-12 animate-in fade-in duration-1000">
        <section className="space-y-4">
          <LectureTag type="Tip" label="Array Geometry" content="Linear = Rectangle. Phased = Sector. Curvilinear = Blunted Sector. Annular = Bullseye." />
          <p className="text-lg leading-relaxed opacity-80">
            Array transducers use <strong>Electronic Timing</strong> (Phasing) to manipulate the sound beam.
          </p>
        </section>

        <ArrayTypesVisual />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-registry-teal">Linear Sequential</h4>
              <p className="text-xs text-slate-400 italic leading-relaxed">Elements fire in sequenced blocks. Each block creates one scan line. If one element breaks, you get a <strong>vertical line of dropout</strong>.</p>
              <div className="h-2 bg-gradient-to-r from-registry-teal to-transparent w-full rounded-full" />
           </div>
           <div className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-registry-rose">Phased Array</h4>
              <p className="text-xs text-slate-400 italic leading-relaxed">All elements fire every time. Firing is staggered by nanoseconds. If one element breaks, you get <strong>erratic steering and focusing</strong>.</p>
              <div className="h-2 bg-gradient-to-r from-registry-rose to-transparent w-full rounded-full" />
           </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <HuygensPrincipleVisual />
           <div className="space-y-6 flex flex-col justify-center">
              <LectureTag type="Def" label="Vector Array" content="A hybrid of linear and phased technologies. Creating a trapezoidal image shape." />
              <LectureTag type="Not" label="Broken Crystal" content="Sonographer tip: Always check your 'Dead Zone'. If you see dropout at the very top of the image, the probe face has a defect." />
              <LectureTag type="Tip" label="Annular Phased" content="Uses ring-shaped crystals. Provides the best lateral resolution at multiple depths but requires mechanical steering." />
           </div>
        </div>

        <section className="bg-stealth-800 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
           <Activity className="absolute -right-8 -bottom-8 w-48 h-48 text-registry-teal opacity-10" />
           <div className="absolute top-0 right-10 -translate-y-1/2 p-4 bg-registry-teal rounded-2xl shadow-glow">
              <Activity className="w-6 h-6 text-stealth-950" />
           </div>
           <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-6">The Secret of "Beam Phasing"</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 border-2 border-registry-teal border-dashed rounded-full flex items-center justify-center font-black">/</div>
                    <div>
                       <span className="font-black text-xs uppercase text-registry-teal tracking-widest">Steering</span>
                       <p className="text-[11px] text-slate-400 mt-1">Staggered Firing: Elements fire in a diagonal sequence (slope). No slope = No steering.</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 border-2 border-registry-teal border-dashed rounded-full flex items-center justify-center font-black">U</div>
                    <div>
                       <span className="font-black text-xs uppercase text-registry-teal tracking-widest">Focusing</span>
                       <p className="text-[11px] text-slate-400 mt-1">Curved Firing: Outer elements fire first, focusing energy into a central point.</p>
                    </div>
                 </div>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3">
                 <h5 className="text-[10px] font-black uppercase text-registry-amber tracking-[0.2em]">Dynamic Receive Focusing</h5>
                 <p className="text-[11px] text-slate-500 leading-relaxed">
                    The machine doesn't just focus on transmission; it staggers the <strong>processing</strong> of returning echoes (Reception Phasing) to continuously refocus as it looks deeper!
                 </p>
              </div>
           </div>
        </section>

        <BeamFocusVisual />
      </div>
    ),
    clinicalImages: [
      {
        url: 'https://picsum.photos/seed/transducer2/1920/1080',
        caption: 'Comparison of image shapes: Linear (Rectangle), Phased Array (Sector), and Curvilinear (Blunted Sector).'
      }
    ],
    quiz: {
      id: "q_m2l2_1",
      type: "mcq" as const,
      question: "Huygens' Principle states that the overall beam is the result of...",
      options: [
        "Reflected wave interference",
        "Interference of many tiny wavelets",
        "Absorption of high frequency sound",
        "Frequency shifts from moving blood"
      ],
      correctAnswer: 1,
      explanation: "Huygens' Principle posits that every point on a wavefront is a source of secondary spherical wavelets. The resulting beam is the constructive interference of these wavelets."
    }
  },
  "2.3": {
    title: 'Focusing Techniques & Beam Geometry',
    narrationScript: "I read over 20 research papers and clinical guidelines for you so here is the cliffnotes version to save you 15 hours of unguided reading. A single textbook wasn't enough, so I aggregated everything into this ultimate guide.\n\nBut as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.\n\n**1. The Roadmap**\n• Part 1: Definitions (What even is Module 2 Topic?).\n• Part 2: Core Concepts/Crash Course.\n• Part 3: Practical Application.\n• Part 4: The \"Holy Sh*t\" Insight.\n\n**2. What it is NOT**\nThe easiest way to first define Module 2 Topic is the given example of what is not Module 2 Topic. It's not just basic imaging.\n\n**3. The Mnemonic**\nHere is a mnemonic in case you can't remember... just think about \"Cats Always Meow\".\n\n**4. Core Concepts / Crash Course**\nHere is what you need to know: In ultrasound, resolution is everything. And to get the best resolution, we must FOCUS the beam.  A beam has a 'Near Zone' (Fresnel zone) and a 'Far Zone' (Fraunhofer zone). The 'Focal Point' is where the beam is narrowest, providing the highest Lateral Resolution.  We can focus beams in three ways:  1. Mechanical (Internal): Corving the PZT crystal. 2. Mechanical (External): Adding an acoustic lens. 3. Electronic (Phased Focusing): The industry standard, allowing the operator to adjust the focal depth on the fly.   Remember: You can only adjust electronic focus. Internal and external focus are fixed during manufacturing. If you see 'Fixed Focus' on the SPI, think single-element probe.\n\n**5. The Analogy**\nThink of this system like a high-performance engine.\n\n**6. Practical Application**\nTo make this actually all practical, I'm going to show you how to apply this workflow which does not require any code.\n\n**7. The \"Holy Sh*t\" Insight**\nIf you master this, you can literally shave 10 minutes off every scan you do!\n\n**8. The Mindset Shift**\nYou do not rise to the level of your goals, you fall to the level of your systems. Use the 2-minute rule to build a habit of checking this first.\n\n**9. The Assessment**\nAs promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Module 2 Topic. Drop your answers in the comments below!",
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <LectureTag type="Concept" label="Beam Geometry" content="The changing shape of the ultrasound beam as it travels through tissue, including the near and far fields." />
          <p className="text-lg leading-relaxed opacity-80">
            An ultrasound beam is not a parallel column; it changes shape as it travels. 
          </p>
        </section>

        <BeamFocusVisual />

        <section className="mt-16 space-y-8">
           <div className="flex items-center space-x-4 mb-4">
              <div className="h-px flex-1 bg-white/5" />
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-registry-rose">Interactive Physics Laboratory</h5>
              <div className="h-px flex-1 bg-white/5" />
           </div>
           <BeamLab />
        </section>

        <section className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
           <h4 className="text-xl font-black uppercase italic tracking-tighter">Beam Zones</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <h5 className="text-registry-teal font-black uppercase text-xs">Near Zone (Fresnel)</h5>
                 <p className="text-[11px] text-slate-400">The region from the transducer to the focus. Beam is narrowing.</p>
              </div>
              <div className="space-y-2">
                 <h5 className="text-registry-rose font-black uppercase text-xs">Far Zone (Fraunhofer)</h5>
                 <p className="text-[11px] text-slate-400">The region starting from the focus. Beam is diverging.</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <h4 className="text-xl font-black uppercase italic tracking-tighter">Methods of Focusing</h4>
           <div className="space-y-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase">Lens (External)</span>
                 <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Fixed</span>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase">Curved Crystal (Internal)</span>
                 <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Fixed</span>
              </div>
              <div className="p-6 bg-registry-teal/10 rounded-2xl border border-registry-teal/20 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase text-registry-teal">Phased Array (Electronic)</span>
                 <span className="text-[11px] font-black uppercase tracking-widest text-registry-teal">Adjustable</span>
              </div>
           </div>
        </section>
      </div>
    ),
    clinicalImages: [
      {
        url: 'https://picsum.photos/seed/beamfocus/1920/1080',
        caption: 'Visualizing the focal zone and beam divergence in the far field.'
      }
    ],
    quiz: {
      id: "q_m2l3_1",
      type: "mcq" as const,
      question: "Which type of focusing is adjustable by the sonographer?",
      options: [
        "External focusing",
        "Internal focusing",
        "Phased array focusing",
        "Lens focusing"
      ],
      correctAnswer: 2,
      explanation: "Phased array focusing (electronic) is adjustable by the operator using the focus knob on the console. Internal and external focusing are fixed at the time of manufacture."
    }
  }
};
