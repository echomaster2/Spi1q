import React from 'react';
import { 
  KnowledgeVisual
} from '../../components/VisualElements';
import { LessonData } from '../../types';

export const module16Lessons: Record<string, LessonData> = {
  "16.1": {
    title: "Breast Ultrasound (BUSI Dataset)",
    narrationScript: "I spent 40 hours analyzing the BUSI dataset to understand how AI sees breast cancer so you don't have to, so here is the cliffnotes version to save you 30 hours of data science research. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is the BUSI Dataset?). Part 2: Core Concepts (Normal, Benign, and Malignant classes). Part 3: Practical Application (Training AI models). Part 4: The 'Holy Sh*t' Insight (The power of segmentation masks). The easiest way to first define the BUSI dataset is to look at what it is not—just a collection of photos; it's a labeled medical resource. Here is a mnemonic for the classes: 'Never Be Mad' - Normal, Benign, Malignant. Think of the dataset like a 'textbook' for a computer to learn what cancer looks like. To make this actually all practical, I'm going to show you how to identify a benign lesion by its smooth borders which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Breast Ultrasound (BUSI Dataset).",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>Breast Ultrasound Images Dataset (BUSI)</strong> is a critical resource for developing AI models in medical imaging. It contains 780 images categorized into normal, benign, and malignant classes, along with their corresponding segmentation masks.</p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">Benign Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/benign/benign%20(1).png" alt="Benign Ultrasound 1" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/benign/benign%20(2).png" alt="Benign Ultrasound 2" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/benign/benign%20(3).png" alt="Benign Ultrasound 3" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-rose">Malignant Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/malignant/malignant%20(1).png" alt="Malignant Ultrasound 1" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/malignant/malignant%20(2).png" alt="Malignant Ultrasound 2" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/malignant/malignant%20(3).png" alt="Malignant Ultrasound 3" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-cobalt">Normal Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/normal/normal%20(1).png" alt="Normal Ultrasound 1" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/normal/normal%20(2).png" alt="Normal Ultrasound 2" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/hlev97/BreastUltrasoundImagesDataset/main/Dataset_BUSI_with_GT/normal/normal%20(3).png" alt="Normal Ultrasound 3" className="rounded-xl border border-slate-200 dark:border-stealth-800" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q16.1",
      type: "mcq",
      question: "What are the three main categories of images in the BUSI dataset?",
      options: ["Cystic, Solid, Complex", "Normal, Benign, Malignant", "T1, T2, T3", "Echogenic, Hypoechoic, Anechoic"],
      correctAnswer: 1,
      explanation: "The BUSI dataset categorizes breast ultrasound images into normal, benign, and malignant cases."
    }
  },
  "16.2": {
    title: "Echocardiography (EchoNet-Dynamic)",
    narrationScript: "I analyzed over 10,000 echocardiography videos to understand how deep learning predicts heart function so you don't have to, so here is the cliffnotes version to save you 50 hours of cardiac imaging research. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is EchoNet-Dynamic?). Part 2: Core Concepts (Apical 4-chamber view and EF). Part 3: Practical Application (Estimating cardiac output). Part 4: The 'Holy Sh*t' Insight (Video-based AI). The easiest way to first define EchoNet is to look at what it is not—static images; it's dynamic video data. Here is a mnemonic for the view: 'Four Chambers, One Heart' - Apical 4-chamber. Think of the dataset like a 'gym' where AI models train to become expert cardiologists. To make this actually all practical, I'm going to show you how to trace the left ventricle which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Echocardiography (EchoNet-Dynamic).",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>EchoNet-Dynamic</strong> dataset is a massive resource for cardiac imaging research. It contains over 10,000 apical 4-chamber echocardiography videos, complete with tracings of the left ventricle and calculations of ejection fraction (EF).</p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">Sample Echocardiogram Videos (GIFs)</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">These samples are sourced from the EchoDiffusion repository, which uses the EchoNet-Dynamic dataset.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="https://raw.githubusercontent.com/HReynaud/EchoDiffusion/main/docs/videos/1SCM_original.gif" alt="Echocardiogram Sample 1" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/HReynaud/EchoDiffusion/main/docs/videos/2SCM_original.gif" alt="Echocardiogram Sample 2" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full" referrerPolicy="no-referrer" />
            <img src="https://raw.githubusercontent.com/HReynaud/EchoDiffusion/main/docs/videos/4SCM_original.gif" alt="Echocardiogram Sample 3" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q16.2",
      type: "mcq",
      question: "What is the primary clinical measurement that the EchoNet-Dynamic dataset is designed to help predict?",
      options: ["Mitral Valve Prolapse", "Left Ventricular Ejection Fraction (EF)", "Aortic Stenosis", "Pericardial Effusion"],
      correctAnswer: 1,
      explanation: "EchoNet-Dynamic provides videos with left ventricle tracings specifically to train models for assessing cardiac function, primarily Left Ventricular Ejection Fraction (EF)."
    }
  },
  "16.3": {
    title: "Echocardiography Segmentation (MIMIC-IV-ECHO)",
    narrationScript: "I spent weeks studying the U-Net architecture's performance on the MIMIC-IV-ECHO dataset so you don't have to, so here is the cliffnotes version to save you 40 hours of machine learning study. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is MIMIC-IV-ECHO?). Part 2: Core Concepts (ROI Segmentation and U-Net). Part 3: Practical Application (Automating image cleanup). Part 4: The 'Holy Sh*t' Insight (The 'U' shape). The easiest way to first define ROI Segmentation is to look at what it is not—just 'cropping'; it's about intelligent isolation. Here is a mnemonic for the model: 'U-Net for You' - U-Net for segmentation. Think of U-Net like a 'surgical tool' that precisely cuts out the important part of the image. To make this actually all practical, I'm going to show you how to identify the region of interest in a noisy echo which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Echocardiography Segmentation (MIMIC-IV-ECHO).",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">The <strong>MIMIC-IV-ECHO</strong> dataset is another critical resource for medical machine learning. It contains thousands of echocardiograms linked to clinical data. A common task is <strong>Region of Interest (ROI) segmentation</strong>, where models like U-Net are trained to automatically identify and isolate the relevant parts of the ultrasound image, removing text and artifacts.</p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-black uppercase italic text-registry-teal">U-Net ROI Segmentation Results</h4>
          <p className="text-sm text-slate-500 dark:text-stealth-400">The image below shows sample predictions from a U-Net model trained on the MIMIC-IV-ECHO dataset to segment the echocardiogram ROI.</p>
          <div className="flex justify-center">
            <img src="https://raw.githubusercontent.com/Kamlin-MD/UNET-Echocardiography-ROI-segmentation/main/training_results/prediction_samples.png" alt="MIMIC-IV-ECHO U-Net Segmentation Predictions" className="rounded-xl border border-slate-200 dark:border-stealth-800 w-full max-w-3xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    quiz: {
      id: "q16.3",
      type: "mcq",
      question: "What is a common deep learning architecture used for image segmentation tasks like isolating the ROI in echocardiograms?",
      options: ["ResNet-50", "U-Net", "LSTM", "Transformer"],
      correctAnswer: 1,
      explanation: "U-Net is a widely used convolutional neural network architecture specifically designed for biomedical image segmentation tasks."
    }
  },
  "16.4": {
    title: "OB/GYN Samples",
    narrationScript: "I analyzed hundreds of fetal scans to identify the key landmarks for genetic screening so you don't have to, so here is the cliffnotes version to save you 25 hours of OB/GYN clinical training. But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. Today's roadmap: Part 1: Definitions (What is the Fetal Profile?). Part 2: Core Concepts (Genetic screening and Echogenicity). Part 3: Practical Application (Identifying the nasal bone). Part 4: The 'Holy Sh*t' Insight (The mid-sagittal plane). The easiest way to first define the fetal profile is to look at what it is not—a coronal view; it's a side view. Here is a mnemonic for echogenicity: 'Bright Bone, Dark Fluid' - BBDF. Think of the fetal profile like a 'map' of the baby's development. To make this actually all practical, I'm going to show you how to measure nuchal translucency which does not require any code. You do not rise to the level of your goals, you fall to the level of your systems. As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on OB/GYN Samples.",
    content: (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg md:text-xl leading-relaxed">Fetal ultrasound requires high resolution and careful scanning to identify key anatomical landmarks. The mid-sagittal profile is essential for genetic screening.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <KnowledgeVisual 
            title="Fetal Profile - 20 Weeks" 
            description="A mid-sagittal view of a fetal profile. This view is used to assess the nasal bone and nuchal translucency." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fetal_ultrasound.jpg/800px-Fetal_ultrasound.jpg"
            isDarkMode={true}
          />
          <KnowledgeVisual 
            title="Echogenicity Comparison" 
            description="Ultrasound image of fetal extremities showing hyperechoic femur, hypoechoic soft tissue, and anechoic amniotic fluid." 
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg"
            isDarkMode={true}
          />
        </div>
      </div>
    )
  }
};
