import React from 'react';
import { LessonData } from '../../../types';
import { 
  TransducerCrossSection,
  PulseEchoPrincipleVisual,
  ArrayTypesVisual,
  BeamFocusVisual,
  HuygensPrincipleVisual,
  LectureTag,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { Zap, HeartPulse, Shield, Target, Activity } from 'lucide-react';

export const module2Lessons: Record<string, LessonData> = {
  "2.1": {
    title: 'Piezoelectric Effect & Single Element Design',
    narrationScript: `Welcome to the heart of the machine: the transducer. In this lesson, we explore the 'Piezoelectric Effect'—the magic that converts electricity into sound and back again. 

When you apply a voltage to a crystal (like Lead Zirconate Titanate, or PZT), it deforms, sending out a sound wave. When the returning echo hits that same crystal, it deforms again, creating a voltage that the machine processes into an image.

But it's not just a crystal. To get a high-quality image, we need a 'Backing Material' to stop the ringing, ensuring short pulses for better axial resolution. And we need a 'Matching Layer' to ensure the sound actually enters the body instead of reflecting off the skin.

Holy Sh*t Insight: Without that matching layer, nearly 100% of your sound would reflect at the skin-transducer interface due to the massive impedance mismatch. The gel you use? That's just the final matching layer.`,
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <LectureTag type="Concept" label="The Piezoelectric Effect" content="The fundamental process of converting electrical energy into mechanical energy and vice versa using specialized crystals." />
          <p className="text-lg leading-relaxed opacity-80">
            Transducers convert one form of energy into another. In ultrasound, we use <strong>Lead Zirconate Titanate (PZT)</strong> to achieve this bidirectionally.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <h4 className="text-registry-teal font-black uppercase text-xs mb-4">Transmission Phase</h4>
              <p className="text-xs leading-relaxed">Electrical spike → Crystal deformation → Pressure wave (Sound)</p>
            </div>
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <h4 className="text-registry-amber font-black uppercase text-xs mb-4">Reception Phase</h4>
              <p className="text-xs leading-relaxed">Echo returns → Crystal deformation → Electrical signal → Image</p>
            </div>
          </div>
        </section>

        <TransducerCrossSection />

        <section className="space-y-6">
          <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">Core Components</h3>
          <div className="space-y-4">
             <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-registry-teal/30 transition-all">
                <div className="p-3 bg-registry-teal/10 rounded-xl">
                   <Shield className="w-5 h-5 text-registry-teal" />
                </div>
                <div>
                   <h5 className="font-black uppercase text-sm mb-1">Matching Layer</h5>
                   <p className="text-xs text-slate-400">One-quarter wavelength thick. Bridges the impedance gap between PZT and skin.</p>
                </div>
             </div>
             <div className="flex items-start space-x-4 p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-registry-amber/30 transition-all">
                <div className="p-3 bg-registry-amber/10 rounded-xl">
                   <Zap className="w-5 h-5 text-registry-amber" />
                </div>
                <div>
                   <h5 className="font-black uppercase text-sm mb-1">Backing Material (Damping)</h5>
                   <p className="text-xs text-slate-400">Reduces 'ringing'. Shortens Spatial Pulse Length (SPL), which dramatically improves Axial Resolution.</p>
                </div>
             </div>
          </div>
        </section>

        <section className="p-8 rounded-[3rem] bg-registry-teal/10 border border-registry-teal/20 relative overflow-hidden">
           <Zap className="absolute -right-8 -bottom-8 w-32 h-32 text-registry-teal opacity-10" />
           <h4 className="text-lg font-black uppercase italic tracking-tighter mb-4 flex items-center">
              <Target className="w-5 h-5 mr-3 text-registry-teal" />
              SPI Master Secret: Impedance Pyramid
           </h4>
           <p className="text-sm leading-relaxed italic">
              Remember the order of impedance from highest to lowest: <br/>
              <strong>PZT {'>'} Matching Layer {'>'} Gel {'>'} Skin</strong>. <br/>
              Each step helps the sound "slide" into the tissue with minimal reflection.
           </p>
        </section>

        <div className="pt-8 border-t border-white/5">
           <KnowledgeVisual title="Axial Resolution" description="The ability of a system to display two structures that are very close together when the structures are parallel to the sound beam's main axis." />
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: 'https://picsum.photos/seed/transducer1/1920/1080',
        caption: 'Internal structure of a multi-element phased array showing the PZT layer and backing.'
      }
    ],
    quiz: {
      id: "q_m2l1_1",
      type: "mcq" as const,
      question: "What is the primary purpose of the backing material in a pulsed wave transducer?",
      options: [
        "To increase sensitivity",
        "To decrease the bandwidth",
        "To improve axial resolution",
        "To increase the pulse duration"
      ],
      correctAnswer: 2,
      explanation: "Backing material damps the crystal ringing, which shortens the pulse. Shorter pulses mean a smaller Spatial Pulse Length (SPL), which directly improves axial resolution."
    }
  },
  "2.2": {
    title: 'Array Systems & Beam Shaping',
    narrationScript: `Single element transducers are relics of the past. Today, we use Array Transducers. These are clusters of dozens to hundreds of 'channels' acting in concert.

Linear Arrays fire in sequences to create large rectangular images, perfect for vascular or small parts. Phased Arrays use complex electrical timing—or 'phasing'—to steer and focus the beam without moving parts, creating that classic sector shape seen in cardiac imaging.

Huygens' Principle explains how this works: each small part of the crystal face acts as a source of 'wavelets'. When these wavelets interfere, they form the composite beam we use for imaging. By changing the timing, we can steer that beam left, right, or straight down.`,
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <LectureTag type="Tip" label="Phased vs Linear Arrays" content="Linear arrays are for rectangular fields (Vascular), Phased arrays are for sector fields (Cardiac)." />
          <p className="text-lg leading-relaxed opacity-80">
            Modem transducers use <strong>arrays</strong> to achieve electronically controlled steering and focusing.
          </p>
        </section>

        <ArrayTypesVisual />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Linear Sequential</h4>
              <p className="text-sm text-slate-400 italic">Elements fire in blocks. Creating a rectangular field of view. Broken elements result in a vertical drop-out line.</p>
              <div className="h-1 bg-registry-teal/20 w-full rounded-full" />
           </div>
           <div className="space-y-4">
              <h4 className="text-xl font-black uppercase italic tracking-tighter">Phased Array</h4>
              <p className="text-sm text-slate-400 italic">All elements fire for every pulse. Timing delays (phasing) steer and focus. Broken elements result in erratic steering or focusing.</p>
              <div className="h-1 bg-registry-rose/20 w-full rounded-full" />
           </div>
        </section>

        <HuygensPrincipleVisual />

        <section className="bg-stealth-800 rounded-[2.5rem] p-10 border border-white/5 relative">
           <div className="absolute top-0 right-10 -translate-y-1/2 p-4 bg-registry-teal rounded-2xl shadow-glow">
              <Activity className="w-6 h-6 text-stealth-950" />
           </div>
           <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4">The "Phasing" Secret</h4>
           <div className="space-y-6">
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 border-2 border-registry-teal border-dashed rounded-full flex items-center justify-center font-black">/</div>
                 <p className="text-xs"><strong>Steering:</strong> Achieved by firing elements in a diagonal Slope.</p>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 border-2 border-registry-teal border-dashed rounded-full flex items-center justify-center font-black">U</div>
                 <p className="text-xs"><strong>Focusing:</strong> Achieved by firing elements in a Curved pattern (Outer elements first).</p>
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
    narrationScript: `In ultrasound, resolution is everything. And to get the best resolution, we must FOCUS the beam.

A beam has a 'Near Zone' (Fresnel zone) and a 'Far Zone' (Fraunhofer zone). The 'Focal Point' is where the beam is narrowest, providing the highest Lateral Resolution.

We can focus beams in three ways: 
1. Mechanical (Internal): Corving the PZT crystal.
2. Mechanical (External): Adding an acoustic lens.
3. Electronic (Phased Focusing): The industry standard, allowing the operator to adjust the focal depth on the fly. 

Remember: You can only adjust electronic focus. Internal and external focus are fixed during manufacturing. If you see 'Fixed Focus' on the SPI, think single-element probe.`,
    content: (
      <div className="space-y-12">
        <section className="space-y-4">
          <LectureTag type="Concept" label="Beam Geometry" content="The changing shape of the ultrasound beam as it travels through tissue, including the near and far fields." />
          <p className="text-lg leading-relaxed opacity-80">
            An ultrasound beam is not a parallel column; it changes shape as it travels. 
          </p>
        </section>

        <BeamFocusVisual />

        <section className="premium-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
           <h4 className="text-xl font-black uppercase italic tracking-tighter">Beam Zones</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <h5 className="text-registry-teal font-black uppercase text-xs">Near Zone (Fresnel)</h5>
                 <p className="text-[10px] text-slate-400">The region from the transducer to the focus. Beam is narrowing.</p>
              </div>
              <div className="space-y-2">
                 <h5 className="text-registry-rose font-black uppercase text-xs">Far Zone (Fraunhofer)</h5>
                 <p className="text-[10px] text-slate-400">The region starting from the focus. Beam is diverging.</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <h4 className="text-xl font-black uppercase italic tracking-tighter">Methods of Focusing</h4>
           <div className="space-y-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase">Lens (External)</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fixed</span>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase">Curved Crystal (Internal)</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fixed</span>
              </div>
              <div className="p-6 bg-registry-teal/10 rounded-2xl border border-registry-teal/20 flex justify-between items-center">
                 <span className="font-bold text-sm uppercase text-registry-teal">Phased Array (Electronic)</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-registry-teal">Adjustable</span>
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
