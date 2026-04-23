import React from 'react';
import { 
  ArtifactsVisual,
  AttenuationComparison,
  KnowledgeVisual,
  LectureTag,
  VideoTutorialLink
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { LessonData } from '../../../types';

export const module5Lessons: Record<string, LessonData> = {
  "5.1": {
    title: "Propagation Artifacts",
    narrationScript: "Welcome to the 'Acoustic Lies' department. I've spent hundreds of hours in the scanning lab troubleshooting why anatomy sometimes appears where it shouldn't, and today I'm giving you the masterclass on Propagation Artifacts. Today's roadmap: Part 1: The 'Straight Line' Assumption—why your machine is easily fooled. Part 2: Reverberation & Comet Tails—the 'ladder' and the 'laser'. Part 3: Mirror Images—the most common diagnostic trap at the diaphragm. Part 4: The 'Holy Sh*t' Insight—how to use artifacts to confirm you're actually looking at a lung. The easiest way to define a propagation artifact is to understand the machine's core assumption: it thinks sound only travels in a straight line at a constant speed. When sound bounces around like a pinball, the machine gets confused and places echoes in the wrong spot. Mnemonic: 'R.C.M.' - Reverberation, Comet tail, Mirror image. Think of a mirror image like a phantom organ. If you see 'liver' above the diaphragm, don't call a surgeon—it's just a reflection! As always, we'll wrap up with a quick assessment to make sure you're ready for the registry.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Propagation Artifacts" />
        <VideoTutorialLink videoId="auG2nND0e7w" title="Ultrasound Artifacts Deep Dive" />
        <ArtifactsVisual />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Diaphragm Mirror Image" 
            description="A classic example of a mirror image artifact. The diaphragm acts as a strong specular reflector, creating a duplicate of the liver parenchyma or a mass above the diaphragm." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ultrasound_mirror_image_artifact.jpg/800px-Ultrasound_mirror_image_artifact.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Comet Tail Artifact" 
            description="A type of reverberation artifact caused by small, highly reflective structures like cholesterol crystals or metal, creating a solid bright line extending downwards." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Comet_tail_artifact_on_ultrasound.jpg/800px-Comet_tail_artifact_on_ultrasound.jpg"
            isDarkMode={true}
          />
        </div>
        <div className="space-y-6">
          <LectureTag type="Concept" label="Reverberation" content="Multiple, equally spaced reflections caused by sound bouncing between two strong reflectors. 'Ladder' appearance." />
          <LectureTag type="Def" label="Comet Tail" content="A form of reverberation (small reflectors) where reflections gradually fizzle out. Ring down = solid line (gas bubbles)." />
          <LectureTag type="Not" label="Mirror Image" content="A copy of real echoes appearing deeper than a curved specular reflector (e.g. diaphragm). Copy is always deeper." />
        </div>
      </div>
    ),
    clinicalImages: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Reverberation_artefact.jpg/800px-Reverberation_artefact.jpg",
        caption: "Reverberation Artifact - Equally spaced horizontal lines caused by sound bouncing between the probe and a strong reflector."
      },
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Aorta_duplication_artifact_131206105958250b.jpg/800px-Aorta_duplication_artifact_131206105958250b.jpg",
        caption: "Mirror Image Artifact - The liver appearing above the diaphragm due to strong reflection."
      }
    ]
  },
  "5.2": {
    title: "Attenuation Artifacts",
    narrationScript: "If propagation artifacts are 'acoustic lies,' attenuation artifacts are 'diagnostic gold.' I've analyzed thousands of scans to help you distinguish between a harmless cyst and a dangerous stone using nothing but shadows and light. Today's roadmap: Part 1: The Physics of Shadowing—why bone and stones go dark. Part 2: Posterior Acoustic Enhancement—the 'flashlight' effect of fluid. Part 3: Edge Shadowing—the refraction trap at the margins. Part 4: The 'Holy Sh*t' Insight—how shadowing can actually help you find the gallbladder. Mnemonic: 'Stones Shadow, Cysts Shine.' Think of shadowing like a solar eclipse—the object is so dense it blocks the 'sunlight' of the ultrasound beam. Enhancement is the opposite; fluid is so easy to travel through that the beam arrives at the deeper tissues with extra energy, making them look brighter. Let's dive in and see if you can spot the difference.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <AttenuationComparison />
        <div className="space-y-6">
          <LectureTag type="Concept" label="Acoustic Shadowing" content="A dark band posterior to a highly reflecting/attenuating object (stones, ribs). Clean shadow = calcified; Dirty shadow = gas." />
          <LectureTag type="Def" label="Enhancement" content="A bright region posterior to a low-attenuating structure (fluid-filled cysts). Beneficial for diagnosis." />
          <LectureTag type="Tip" label="Edge Shadowing" content="Dropout at lateral edges of round structures caused by refraction (oblique incidence + different prop speed)." />
          <LectureTag type="Tip" label="Registry Tip" content="Increasing frequency increases shadowing because it increases attenuation." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Gallstone Shadowing" 
            description="A highly attenuating gallstone blocks the sound beam, creating a dark 'clean' shadow deep to the stone." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Breast Cyst Enhancement" 
            description="A simple breast cyst showing posterior acoustic enhancement. The fluid in the cyst attenuates sound less than the surrounding tissue, making the area behind it appear brighter." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Breast_cyst_ultrasound.jpg/800px-Breast_cyst_ultrasound.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Edge Shadowing Artifact" 
            description="Refraction at the curved edges of a circular structure (like a cyst) causes the beam to diverge, creating shadows at the edges. This is a classic refraction artifact." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ultrasound_of_a_normal_kidney.jpg/800px-Ultrasound_of_a_normal_kidney.jpg"
            isDarkMode={true}
          />
        </div>
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">Acoustic Shadowing Example</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">Notice the dark band extending downwards from the bright calcification, caused by the strong attenuation of the ultrasound beam.</p>
          <div className="flex justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Ultrasonography_of_orpus_cavernosum_calcification.jpg" alt="Acoustic Shadowing Artifact" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    )
  },
};
