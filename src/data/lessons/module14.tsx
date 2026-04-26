import React from 'react';
import { 
  LectureTag,
  ScanConverterVisual,
  PrePostProcessingVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { Database, Monitor, Cloud, Cpu, HardDrive, Wifi, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { LessonData } from '../../../types';

export const module14Lessons: Record<string, LessonData> = {
  "14.1": {
    title: "The Scan Converter",
    narrationScript: "Computers changed everything. Before digital scan converters, ultrasound images faded away like old polaroids. Today, your machine translates acoustic energy into binary code. We'll look at pixels, bits, and how your machine stores shades of gray. Remember: 2 to the power of n. That's your secret weapon for calculating the number of gray shades available in your image.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Digital Conversion" />
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>Scan Converter</strong> is the bridge between the analog world of sound and the digital world of computers. It 'converts' the vertical spoke-line data into horizontal video-line data that can be displayed and stored.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScanConverterVisual />
          <div className="premium-glass p-8 rounded-[2rem] border tech-border flex flex-col justify-center space-y-6">
             <div className="flex items-center space-x-3">
                <Cpu className="w-6 h-6 text-registry-teal" />
                <h4 className="text-lg font-black uppercase italic italic">Pixels & Bits</h4>
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Pixel (Picture Element)</p>
                   <p className="text-xs">The smallest building block of a digital image. More pixels = Better spatial resolution.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-[11px] font-black uppercase text-slate-500 mb-1">Bit (Binary Digit)</p>
                   <p className="text-xs">The smallest unit of computer memory. More bits = More shades of gray = Better contrast resolution.</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LectureTag type="Not" label="Binary Math" content="To calculate gray shades: 2^n. If you have 8 bits, you have 2^8 = 256 shades of gray. This is standard for most modern systems." />
          <LectureTag type="Tip" label="Preprocessing" content="Occurs BEFORE the data is stored in memory. If you change a setting and the image must be re-acquired, it's preprocessing (e.g. TGC, Depth)." />
          <LectureTag type="Tip" label="Postprocessing" content="Occurs AFTER storage. If you can perform the change on a frozen image, it's postprocessing (e.g. Read Zoom, Contrast adjustment)." />
        </div>
        
        <PrePostProcessingVisual />
      </div>
    ),
    quiz: { 
      id: "q14.1", 
      type: "mcq", 
      question: "Which of the following determines the number of gray shades available in a digital scan converter?", 
      options: ["The number of pixels", "The number of bits per pixel", "The frame rate", "The transduction efficiency"], 
      correctAnswer: 1, 
      explanation: "The number of bits assigned to each pixel determines the shades of gray (2^n). Pixels determine spatial resolution, but bits determine contrast resolution." 
    }
  },
  "14.2": {
    title: "PACS & DICOM",
    narrationScript: "Once you take the image, where does it go? In the old days, it was a physical film. Today, it's a server. PACS is your digital warehouse, and DICOM is the language that makes sure your GE machine can talk to your Philips workstation. This is the plumbing of the modern hospital.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="flex items-center space-x-3 text-registry-teal mb-4">
                 <HardDrive className="w-8 h-8" />
                 <h4 className="text-2xl font-black uppercase italic">PACS</h4>
              </div>
              <p className="text-sm font-bold opacity-70">Picture Archiving and Communication System. The digital system for storing and sharing medical images across the network.</p>
              <LectureTag type="Concept" label="Primary Storage" content="Hard drives (RAID arrays) for fast access. Recent studies are stored here for immediate review." />
              <LectureTag type="Concept" label="Archive Storage" content="Cloud or tape backup for long-term storage (years). Slower access but cheaper for bulk data." />
           </div>
           <div className="premium-glass p-8 rounded-[2rem] border-2 tech-border bg-stealth-900 flex flex-col items-center justify-center text-center">
              <Database className="w-16 h-16 text-registry-teal mb-6 animate-pulse" />
              <div className="space-y-2">
                 <p className="text-xl font-black text-white italic">DICOM Standard</p>
                 <p className="text-[11px] uppercase font-bold text-slate-500 tracking-widest">Digital Imaging and Computers in Medicine</p>
              </div>
              <p className="text-xs mt-6 opacity-60">The universal language of medical imaging. It ensures that images, patient data, and metadata can be shared between different vendors and systems.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LectureTag type="Not" label="Lossy Compression" content="Reduces file size but loses image data. Generally avoided in primary clinical diagnosis to maintain high resolution." />
          <LectureTag type="Tip" label="Lossless Compression" content="Reduces file size WITHOUT losing any data. This is preferred for medical archiving." />
          <LectureTag type="Tip" label="Worklist" content="A DICOM service that sends patient names and IDs directly to the ultrasound machine from the hospital's central computer." />
        </div>
      </div>
    ),
    quiz: { 
      id: "q14.2", 
      type: "mcq", 
      question: "What is the primary function of a DICOM network?", 
      options: ["To convert sound to video", "To allow different imaging devices to communicate", "To increase frame rate", "To reduce acoustic noise"], 
      correctAnswer: 1, 
      explanation: "DICOM is a set of rules that allows imaging devices (regardless of manufacturer) to share data and communication across a network." 
    }
  },
  "14.3": {
    title: "Cloud Integration",
    narrationScript: "The future is off-site. Cloud storage is changing how we handle massive datasets from 3D volumes and elastography. We'll look at the pros and cons of cloud-based PACS and how high-speed networking is finally catching up to the data demands of modern scanning.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="flex items-center space-x-4">
           <Cloud className="w-10 h-10 text-registry-cobalt" />
           <div className="h-px flex-1 bg-white/5" />
           <span className="text-[11px] font-black uppercase tracking-widest opacity-40">Next Gen Archiving</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h4 className="text-3xl font-black italic uppercase leading-tight">Beyond the <span className="text-registry-teal">On-Prem</span> Archive</h4>
              <p className="text-lg opacity-80 leading-relaxed italic">As ultrasound data grows from simple 2D frames to multi-gigabyte 4D volumes, traditional hospital servers are hitting their limits.</p>
              <div className="space-y-4">
                 <div className="flex items-start space-x-4">
                    <Wifi className="w-5 h-5 text-registry-teal mt-1" />
                    <div>
                       <p className="font-bold text-sm">Fiber Optic Links</p>
                       <p className="text-xs opacity-60">Crucial for handling the high bandwidth required for real-time remote consultations and rapid uploads.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <Shield className="w-5 h-5 text-registry-rose mt-1" />
                    <div>
                       <p className="font-bold text-sm">HIPAA Compliance</p>
                       <p className="text-xs opacity-60">Cloud storage must be encrypted both in transit and at rest to protect sensitive patient information.</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="relative group">
              <div className="absolute inset-0 bg-registry-teal/10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="premium-glass p-8 rounded-[2.5rem] border tech-border relative z-10">
                 <h5 className="text-sm font-black uppercase tracking-widest text-registry-teal mb-6">AI Cloud Analysis</h5>
                 <p className="text-sm leading-relaxed mb-8">Modern systems can now offload heavy computation to the cloud. AI algorithms can analyze your images for automated measurements, edge detection, and even diagnostic suggestions in real-time.</p>
                 <div className="p-4 bg-stealth-950 rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-2 mb-2">
                       <Cpu className="w-4 h-4 text-registry-rose" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Processing Node: ACTIVE</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="h-full w-1/3 bg-registry-teal"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    ),
    quiz: { 
      id: "q14.3", 
      type: "mcq", 
      question: "Which transmission technology provides the highest bandwidth for hospital image networks?", 
      options: ["Traditional Telephone Lines", "Fiber Optic Cable", "Infrared transmission", "Coaxial cable"], 
      correctAnswer: 1, 
      explanation: "Fiber optic cables use light pulses to transmit data, offering vastly superior bandwidth and speed compared to copper-based electrical wires." 
    }
  }
};
