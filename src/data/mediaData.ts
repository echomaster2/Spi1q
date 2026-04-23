export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
  duration: string;
  script: string;
  assessment?: Question[];
}

export interface VisualItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  assessment?: Question[];
}

export const VISUALS: VisualItem[] = [
  {
    id: 'v1',
    title: 'Figure 1.1: Frequency of Sound',
    description: 'Frequency of sound is the number of cycles per second (s) and is expressed in Hertz (1 cycle / sec). In Wave A, the frequency is 2 cycles per sec or 2 Hertz and in wave B the frequency is 3 cycles per sec or 3 Hertz.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
    category: 'Physics Basics',
    assessment: [
      {
        id: 'q-v1-1',
        question: 'If a sound wave has a frequency of 5 Hertz, how many cycles occur in 2 seconds?',
        options: ['5 cycles', '10 cycles', '2.5 cycles', '20 cycles'],
        correctAnswer: 1,
        explanation: 'Frequency is cycles per second. 5 Hz means 5 cycles per second. In 2 seconds, 5 * 2 = 10 cycles occur.'
      }
    ]
  },
  {
    id: 'v2',
    title: 'Figure 1.2: Amplitude',
    description: 'Amplitude (A) is defined by the difference between the peak (maximum) or trough (minimum) of the wave and the average value. Units of amplitude are expressed in million Pascals (MPa).',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
    category: 'Physics Basics',
    assessment: [
      {
        id: 'q-v2-1',
        question: 'Which of the following units is used to express the amplitude of an acoustic pressure wave in clinical imaging?',
        options: ['Watts', 'Hertz', 'MegaPascals (MPa)', 'Rayls'],
        correctAnswer: 2,
        explanation: 'In clinical ultrasound imaging, pressure amplitude is typically expressed in MegaPascals (MPa).'
      }
    ]
  },
  {
    id: 'v3',
    title: 'Figure 1.3: Wavelength',
    description: 'The wavelength of a sound wave is the length of a wave and is defined as the distance of a complete cycle. It is designated by the symbol lambda (λ), and is expressed in mm.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
    category: 'Physics Basics',
    assessment: [
      {
        id: 'q-v3-1',
        question: 'As frequency increases, what happens to the wavelength in a given medium?',
        options: ['Increases', 'Decreases', 'Stays the same', 'Doubles'],
        correctAnswer: 1,
        explanation: 'Wavelength and frequency are inversely proportional (λ = c/f). As frequency increases, wavelength decreases.'
      }
    ]
  },
  {
    id: 'v4',
    title: 'Figure 1.4: Piezoelectric Crystals',
    description: 'Piezoelectric crystals shown within a transducer. Note the symmetrical arrangement of the crystals. The crystals convert electric current to ultrasound and vice versa.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/UltrasoundProbe2006a.jpg/800px-UltrasoundProbe2006a.jpg',
    category: 'Transducers',
    assessment: [
      {
        id: 'q-v4-1',
        question: 'What is the primary material used for piezoelectric elements in modern transducers?',
        options: ['Quartz', 'Lead Zirconate Titanate (PZT)', 'Tungsten', 'Silicon'],
        correctAnswer: 1,
        explanation: 'PZT (Lead Zirconate Titanate) is the most common synthetic ceramic used for piezoelectric elements.'
      }
    ]
  },
  {
    id: 'v5',
    title: 'Figure 1.5: Echogenicity',
    description: 'Ultrasound image of fetal extremities. Note the hyperechoic femur, the hypoechoic soft tissue in the thigh and anechoic amniotic fluid.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ultrasound_liver_right_lobe_and_right_kidney.jpg/800px-Ultrasound_liver_right_lobe_and_right_kidney.jpg',
    category: 'Image Formation',
    assessment: [
      {
        id: 'q-v5-1',
        question: 'Which term describes a structure that is completely black (echo-free) on ultrasound?',
        options: ['Hyperechoic', 'Hypoechoic', 'Isoechoic', 'Anechoic'],
        correctAnswer: 3,
        explanation: 'Anechoic means without echoes, appearing black on the screen (e.g., simple fluid).'
      }
    ]
  },
  {
    id: 'v19',
    title: 'Diaphragm Mirror Image',
    description: 'A classic example of a mirror image artifact. The diaphragm acts as a strong specular reflector, creating a duplicate of the liver parenchyma or a mass above the diaphragm.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Aorta_duplication_artifact_131206105958250b.jpg/800px-Aorta_duplication_artifact_131206105958250b.jpg',
    category: 'Artifacts',
    assessment: [
      {
        id: 'q-v19-1',
        question: 'In a mirror image artifact of the liver, where is the false duplicate image located?',
        options: ['Deep to the diaphragm', 'Superficial to the diaphragm', 'Inside the gallbladder', 'In the kidney'],
        correctAnswer: 0,
        explanation: 'The false duplicate is always placed deeper than the real structure because the sound takes longer to return after reflecting off the mirror.'
      }
    ]
  },
  {
    id: 'v20',
    title: 'Gallstone with Posterior Shadowing',
    description: 'A highly attenuating gallstone blocks the sound beam, creating a dark "clean" shadow deep to the stone.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Gallstones.PNG/800px-Gallstones.PNG',
    category: 'Artifacts',
    assessment: [
      {
        id: 'q-v20-1',
        question: 'What physical process primarily causes the shadowing seen behind a gallstone?',
        options: ['Refraction', 'Absorption and Reflection', 'Scattering', 'Enhancement'],
        correctAnswer: 1,
        explanation: 'Shadowing occurs because the stone either absorbs or reflects nearly all the sound energy, leaving none to travel deeper.'
      }
    ]
  }
];

export const VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'Ultrasound Physics Basics',
    description: 'A comprehensive overview of sound waves, frequency, and propagation in tissue.',
    embedUrl: 'https://www.youtube.com/embed/O_1vR11cM4o',
    thumbnail: 'https://img.youtube.com/vi/O_1vR11cM4o/hqdefault.jpg',
    duration: '15:24',
    script: `I read through 5 different physics textbooks and 20 hours of lectures for you...`,
    assessment: [
      {
        id: 'q1-1',
        question: 'What is the average propagation speed of sound in soft tissue?',
        options: ['330 m/s', '1,450 m/s', '1,540 m/s', '3,500 m/s'],
        correctAnswer: 2,
        explanation: 'The standard assumed speed for soft tissue is 1,540 m/s.'
      },
      {
        id: 'q1-2',
        question: 'Which of the following is NOT a component of attenuation?',
        options: ['Absorption', 'Scattering', 'Reflection', 'Demodulation'],
        correctAnswer: 3,
        explanation: 'Demodulation is a receiver function, not a component of sound attenuation.'
      }
    ]
  },
  {
    id: '5',
    title: 'Vascular Ultrasound & Hemodynamics',
    description: 'Deep dive into blood flow patterns, pressure gradients, and vascular pathology.',
    embedUrl: 'https://www.youtube.com/embed/5D1gV37bKOU',
    thumbnail: 'https://img.youtube.com/vi/5D1gV37bKOU/hqdefault.jpg',
    duration: '28:15',
    script: `Welcome to the Vascular Masterclass...`,
    assessment: [
      {
        id: 'q5-1',
        question: 'According to Bernoulli\'s Principle, what happens to pressure at the site of a stenosis where velocity is highest?',
        options: ['Pressure increases', 'Pressure decreases', 'Pressure stays the same', 'Pressure fluctuates'],
        correctAnswer: 1,
        explanation: 'Bernoulli\'s Principle states that as velocity increases, pressure must decrease to maintain energy balance.'
      }
    ]
  }
];
