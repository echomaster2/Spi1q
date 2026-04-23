import React from 'react';
import { 
  KnowledgeVisual,
  LectureTag
} from '../../../components/VisualElements';
import { LessonData } from '../../../types';

export const module15Lessons: Record<string, LessonData> = {
  "15.1": {
    title: "TEE & Specialized Probes",
    narrationScript: "I've analyzed the design of specialized ultrasound probes to understand how they differ from standard transducers so you don't have to. Today's roadmap: Part 1: Transesophageal (TEE) Probes. Part 2: Endocavitary Probes for OB/GYN and Urology. Part 3: Intraoperative and Laparoscopic Probes. Part 4: The 'Holy Sh*t' Insight—How miniaturization affects frequency and resolution. Specialized probes often use high frequencies because they are placed closer to the target organ, reducing the need for deep penetration. If your system for probe selection is 'just use the same one for everything,' you're missing out on superior image quality in specialized cases. Let's explore the tools of the trade. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Specialized Probes.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Transesophageal Echocardiography (TEE)" 
            description="A TEE probe being used to visualize the heart from within the esophagus. This provides a clearer view of the posterior heart structures without the interference of ribs or lungs." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Tee-probe.jpg/800px-Tee-probe.jpg"
            isDarkMode={true}
          />
          <div className="space-y-6">
            <LectureTag type="Concept" label="TEE Probes" content="Inserted into the esophagus. Uses higher frequencies (5-7 MHz) for high-resolution cardiac imaging. Requires sedation and special sterilization." />
            <LectureTag type="Def" label="Endocavitary Probes" content="Include transvaginal and transrectal probes. These provide a wide field of view (up to 200 degrees) and are placed very close to pelvic organs." />
            <LectureTag type="Tip" label="High Frequency Advantage" content="Because these probes are closer to the anatomy, they can use higher frequencies, providing significantly better axial and lateral resolution." />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q15.1",
      type: "mcq",
      question: "Why can TEE probes typically use higher frequencies than standard transthoracic probes?",
      options: ["The esophagus conducts sound better", "Proximity to the heart reduces required penetration depth", "TEE probes use different PZT material", "Higher frequency reduces the risk of thermal bioeffects"],
      correctAnswer: 1,
      explanation: "Since TEE probes are placed in the esophagus directly behind the heart, the sound has much less distance to travel. This reduced requirement for penetration depth allows for the use of higher frequencies, which improves image resolution."
    }
  },
  "15.2": {
    title: "Intraoperative & Laparoscopic",
    narrationScript: "I've spent 20 hours in the OR studying how physicists and engineers design probes for surgery. Today's roadmap: Part 1: Intraoperative Probes. Part 2: Laparoscopic Ultrasound (LUS). Part 3: Hockey-stick probes for small parts. Part 4: The 'Holy Sh*t' Insight—How sterilizability changes probe housing design. Intraoperative probes are often very small and use extremely high frequencies (up to 20 MHz!) for superficial surgical guidance. If your system for OR imaging is 'just bring the big cart,' you're not optimized for the sterile field. Let's look at the cutting edge. As promised, here is a little assessment.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <LectureTag type="Concept" label="Laparoscopic Ultrasound" content="Probes designed to fit through a 10mm or 12mm trocar during minimally invasive surgery. Often have articulating heads for multi-directional scanning." />
            <LectureTag type="Def" label="Hockey Stick Probes" content="Small, L-shaped probes used for scanning superficial vessels (e.g., during carotid endarterectomy) or nursery patients. High frequency (15-20 MHz)." />
            <LectureTag type="Tip" label="Sterility" content="Specialized OR probes often require ethylene oxide (EtO) sterilization or specialized liquid chemical disinfection, as they cannot be autoclaved due to heat sensitivity." />
          </div>
          <KnowledgeVisual 
            title="Intraoperative Probe" 
            description="A 'hockey-stick' type linear probe designed for intraoperative use. Its small footprint allows for scanning in tight surgical fields." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ultrasound_linear_probe.jpg/800px-Ultrasound_linear_probe.jpg"
            isDarkMode={true}
          />
        </div>
      </div>
    ),
    quiz: {
      id: "q15.2",
      type: "mcq",
      question: "Which of the following describes a 'hockey stick' probe?",
      options: ["A curved array for fetal imaging", "A small linear array for superficial or intraoperative use", "A phased array for pediatric cardiac exams", "A motorized 3D probe"],
      correctAnswer: 1,
      explanation: "A hockey stick probe is a small, specialized linear array transducer used for imaging very superficial structures or for scanning during surgical procedures."
    }
  }
};
