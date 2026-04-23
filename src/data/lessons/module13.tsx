import React from 'react';
import { 
  LectureTag,
  KnowledgeVisual
} from '../../../components/VisualElements';
import { LessonAnthem } from '../../../components/LessonAnthem';
import { Target, BarChart, Percent, Activity } from 'lucide-react';
import { LessonData } from '../../../types';

export const module13Lessons: Record<string, LessonData> = {
  "13.1": {
    title: "Diagnostic Accuracy",
    narrationScript: "Welcome to the numbers game. In sonography, we don't just take images; we provide data that changes patient lives. But how do we know if our 'positive' is actually positive? Today we dive into the gold standard and the metrics of truth. We'll explore accuracy, reliability, and why your registry exam loves to test you on these calculations. Remember, a tool is only as good as the person using it—and the data backing it up.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="The Gold Standard" />
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>Gold Standard</strong> is the ultimate 'perfect' test (like biopsy or surgery) used to verify ultrasound findings. Every calculation we make—Sensitivity, Specificity, Accuracy—is a comparison against this ground truth.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="The 2x2 Matrix" 
            description="The foundation of statistical testing. We categorize every result into four bins: True Positive (TP), True Negative (TN), False Positive (FP), and False Negative (FN)." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Diagnostic_Testing_2x2_Table.png/600px-Diagnostic_Testing_2x2_Table.png"
            isDarkMode={true}
          />
          <div className="premium-glass p-8 rounded-[2rem] border tech-border flex flex-col justify-center">
             <div className="flex items-center space-x-3 mb-6">
                <BarChart className="w-6 h-6 text-registry-teal" />
                <h4 className="text-lg font-black uppercase italic italic">Accuracy Calculation</h4>
             </div>
             <p className="text-2xl font-black text-registry-teal mb-4">(TP + TN) / TOTAL</p>
             <p className="text-sm opacity-60">Accuracy represents how often the test is correct overall, regardless of whether the finding is positive or negative.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LectureTag type="Concept" label="True Positive (TP)" content="The ultrasound says 'disease' and the Gold Standard agrees 'disease'. Perfect match." />
          <LectureTag type="Not" label="False Negative (FN)" content="The most dangerous error. Ultrasound says 'normal' but the patient actually has disease. This leads to missed diagnoses." />
          <LectureTag type="Tip" label="Registry Rule" content="Accuracy will always fall between Sensitivity and Specificity value-wise. It is the weighted average of the two." />
        </div>
      </div>
    ),
    quiz: { 
      id: "q13.1", 
      type: "mcq", 
      question: "If an ultrasound scan correctly identifies 90 patients with disease (TP) and correctly identifies 80 patients as healthy (TN) out of a total of 200 patients, what is the accuracy?", 
      options: ["45%", "85%", "170%", "90%"], 
      correctAnswer: 1, 
      explanation: "Accuracy = (TP + TN) / Total. (90 + 80) / 200 = 170 / 200 = 0.85 or 85%." 
    }
  },
  "13.2": {
    title: "Sensitivity & Specificity",
    narrationScript: "If you remember nothing else from this module, remember this: Sensitivity is about the sick, and Specificity is about the healthy. In the registry, they will try to trip you up with wordplay. Sensitive tests don't miss disease. Specific tests don't cry wolf. Let's break down the math so you can nail these questions in under 10 seconds.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <LessonAnthem stationName="Sensitivity (SENS)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <LectureTag type="Def" label="Sensitivity" content="The ability of a test to detect disease when it is present. TP / (TP + FN)." />
              <LectureTag type="Tip" label="Memory Trick" content="SENSitivity = SICK. It looks at the column of people who actually HAVE the disease." />
           </div>
           <div className="premium-glass p-8 rounded-[2rem] border tech-border bg-registry-teal/5">
              <div className="flex items-center space-x-3 mb-4">
                 <Percent className="w-5 h-5 text-registry-teal" />
                 <span className="text-xs font-black uppercase tracking-widest">Formula Node</span>
              </div>
              <p className="text-3xl font-black italic">TP / (TP + FN)</p>
           </div>
        </div>

        <LessonAnthem stationName="Specificity (SPEC)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="premium-glass p-8 rounded-[2rem] border tech-border bg-registry-rose/5">
              <div className="flex items-center space-x-3 mb-4">
                 <Percent className="w-5 h-5 text-registry-rose" />
                 <span className="text-xs font-black uppercase tracking-widest">Formula Node</span>
              </div>
              <p className="text-3xl font-black italic">TN / (TN + FP)</p>
           </div>
           <div className="space-y-6">
              <LectureTag type="Def" label="Specificity" content="The ability of a test to identify 'normal' when no disease is present. TN / (TN + FP)." />
              <LectureTag type="Tip" label="Memory Trick" content="SPECificity = healthy. It's about being SPECIFIC so you don't call a healthy person sick." />
           </div>
        </div>

        <div className="p-8 bg-slate-900 border border-white/10 rounded-[3rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-32 h-32 text-registry-teal" />
           </div>
           <h4 className="text-xl font-black uppercase italic text-white mb-4">Predictive Values</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <p className="text-registry-teal font-black text-sm uppercase">Positive Predictive Value (PPV)</p>
                 <p className="text-xs text-slate-400">TP / (TP + FP). If the test is positive, what are the odds the patient actually has it?</p>
              </div>
              <div className="space-y-2">
                 <p className="text-registry-rose font-black text-sm uppercase">Negative Predictive Value (NPV)</p>
                 <p className="text-xs text-slate-400">TN / (TN + FN). If the test is negative, what are the odds the patient is truly clean?</p>
              </div>
           </div>
        </div>
      </div>
    ),
    quiz: { 
      id: "q13.2", 
      type: "mcq", 
      question: "Which of the following describes a test's ability to exclude disease in healthy patients?", 
      options: ["Sensitivity", "Specificity", "Positive Predictive Value", "Accuracy"], 
      correctAnswer: 1, 
      explanation: "Specificity is the ability to correctly identify healthy (normal) subjects. Sensitivity is the ability to correctly identify diseased (sick) subjects." 
    }
  },
  "13.3": {
    title: "Reliability & Bias",
    narrationScript: "Numbers don't lie, but people do—or machines do. Reliability is about consistency. If I measure a 4cm cyst today and you measure it as 2cm tomorrow, we have a reliability problem. Today we'll define intra-observer and inter-observer variability, and how bias can sneak into even the best studies.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LectureTag type="Concept" label="Reliability" content="The consistency of a measure. If you repeat the test multiple times, do you get the same result?" />
          <LectureTag type="Concept" label="Inter-observer" content="Difference between two different people performing the same test." />
          <LectureTag type="Concept" label="Intra-observer" content="Difference when the SAME person performs the test multiple times." />
        </div>
        
        <div className="premium-glass p-12 rounded-[3.5rem] border tech-border relative overflow-hidden">
           <div className="flex items-center space-x-6 mb-8">
              <div className="w-12 h-12 bg-registry-teal/10 rounded-2xl flex items-center justify-center">
                 <Activity className="w-6 h-6 text-registry-teal" />
              </div>
              <h4 className="text-2xl font-black uppercase italic italic">Types of Bias</h4>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                 <p className="text-sm font-black text-registry-teal uppercase tracking-widest">Selection Bias</p>
                 <p className="text-xs opacity-60">The study group isn't representative of the real population.</p>
              </div>
              <div className="space-y-4">
                 <p className="text-sm font-black text-registry-rose uppercase tracking-widest">Information Bias</p>
                 <p className="text-xs opacity-60">Errors in measurement or data collection (like a faulty phantom).</p>
              </div>
              <div className="space-y-4">
                 <p className="text-sm font-black text-registry-amber uppercase tracking-widest">Confounding Bias</p>
                 <p className="text-xs opacity-60">An hidden external factor that influences both the test and the outcome.</p>
              </div>
           </div>
        </div>
      </div>
    ),
    quiz: { 
      id: "q13.3", 
      type: "mcq", 
      question: "If two different sonographers measure the same structure and get significantly different results, this is a failure of:", 
      options: ["Intra-observer reliability", "Inter-observer reliability", "Specificity", "Sensitivity"], 
      correctAnswer: 1, 
      explanation: "Inter-observer reliability refers to the consistency of results between two or more different observers." 
    }
  }
};
