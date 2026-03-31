export interface ClinicalTip {
  id: string;
  title: string;
  content: string;
  category: 'Ergonomics' | 'Optimization' | 'Patient Care' | 'Physics' | 'Artifacts' | 'Scanning Technique' | 'Doppler' | 'Instrumentation';
}

export const CLINICAL_TIPS: ClinicalTip[] = [
  {
    id: 'tip-1',
    title: 'Hand Stability',
    content: 'Rest your scanning hand on the patient\'s body or a bolster to stabilize the probe and reduce muscle fatigue during long exams.',
    category: 'Ergonomics'
  },
  {
    id: 'tip-2',
    title: 'Gel Usage',
    content: 'Always use a generous amount of gel. Air is the enemy of ultrasound; even tiny air pockets can cause significant artifacts and loss of signal.',
    category: 'Patient Care'
  },
  {
    id: 'tip-3',
    title: 'Focal Zone Alignment',
    content: 'Keep your focal zone at or slightly below the area of interest. This ensures the narrowest part of the beam is where you need it most for lateral resolution.',
    category: 'Optimization'
  },
  {
    id: 'tip-4',
    title: 'ALARA Principle',
    content: 'If the image is too dark, increase the Receiver Gain first. Only increase Output Power if gain is insufficient, to minimize patient exposure.',
    category: 'Physics'
  },
  {
    id: 'tip-5',
    title: 'Frequency Selection',
    content: 'Use the highest frequency possible that still allows for adequate penetration. Higher frequency equals better axial resolution.',
    category: 'Physics'
  },
  {
    id: 'tip-6',
    title: 'Gallbladder Window',
    content: 'Have the patient take a deep breath and hold it. This moves the liver (and gallbladder) inferiorly, often providing a better acoustic window.',
    category: 'Patient Care'
  },
  {
    id: 'tip-7',
    title: 'Aliasing Fix',
    content: 'To fix Doppler aliasing: Increase the PRF (Scale), shift the baseline, or use a lower frequency transducer.',
    category: 'Artifacts'
  },
  {
    id: 'tip-8',
    title: 'TGC Adjustment',
    content: 'Adjust TGCs so that the liver parenchyma (or similar tissue) appears uniform in brightness from the near field to the far field.',
    category: 'Optimization'
  },
  {
    id: 'tip-9',
    title: 'Shadowing vs. Enhancement',
    content: 'Use shadowing to confirm stones (highly attenuating) and enhancement to confirm cysts (low attenuating). It\'s a key diagnostic tool!',
    category: 'Artifacts'
  },
  {
    id: 'tip-10',
    title: 'Patient Orientation',
    content: 'Always ensure the transducer notch is oriented correctly (usually toward the patient\'s head or right side) to maintain standard image orientation.',
    category: 'Patient Care'
  },
  {
    id: 'tip-11',
    title: 'Dynamic Range',
    content: 'Decrease dynamic range (increase contrast) to better visualize borders of solid masses. Increase it for a smoother, more "gray" image of parenchyma.',
    category: 'Optimization'
  },
  {
    id: 'tip-12',
    title: 'Probe Pressure',
    content: 'Apply firm but gentle pressure. Too much pressure can compress superficial vessels or cause patient discomfort; too little results in poor contact.',
    category: 'Ergonomics'
  },
  {
    id: 'tip-11',
    title: "The 'Sweep' Technique",
    content: "When looking for small structures like the appendix or a small stone, use a slow, deliberate sweep. Moving too fast can cause you to miss subtle findings that only appear for a fraction of a second.",
    category: "Scanning Technique"
  },
  {
    id: 'tip-12',
    title: "Ergonomics: The 90-Degree Rule",
    content: "Keep your scanning arm at a 90-degree angle to your body whenever possible. Reaching too far or high leads to shoulder strain and long-term injury. Move the patient closer to you instead.",
    category: "Ergonomics"
  },
  {
    id: 'tip-13',
    title: "Color Doppler Sensitivity",
    content: "If you can't see flow, try decreasing your PRF (Scale) and increasing your Color Gain until you see speckle, then back off slightly. Also, ensure your steering angle is not 90 degrees to the vessel.",
    category: "Doppler"
  },
  {
    id: 'tip-14',
    title: "Patient Positioning for Gallbladder",
    content: "If the gallbladder is obscured by bowel gas, try the Left Lateral Decubitus (LLD) position. This often shifts the liver and gallbladder away from the gas and closer to the anterior wall.",
    category: "Patient Care"
  },
  {
    id: 'tip-15',
    title: "TGC Optimization",
    content: "Your TGC should generally follow a smooth curve. If you find yourself making jagged adjustments, check your overall gain or consider if you are using the wrong transducer frequency for that depth.",
    category: "Instrumentation"
  }
];
