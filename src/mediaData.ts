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
  citation?: string;
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sine_wave_amplitude_wavelength.svg/800px-Sine_wave_amplitude_wavelength.svg.png',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ultrasound_transducer_types.jpg/800px-Ultrasound_transducer_types.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ultrasound_of_the_liver_and_right_kidney.jpg/800px-Ultrasound_of_the_liver_and_right_kidney.jpg',
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
    id: 'v6',
    title: 'A-Mode Ultrasound',
    description: 'Amplitude mode (A-mode) display showing spikes representing the depth and strength of echoes. Commonly used in ophthalmology.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/A-scan_ultrasound_of_the_eye.jpg/800px-A-scan_ultrasound_of_the_eye.jpg',
    category: 'Display Modes',
    assessment: [
      {
        id: 'q-v6-1',
        question: 'In A-mode, what does the height of the spike represent?',
        options: [
          'Depth',
          'Amplitude (Strength)',
          'Velocity',
          'Frequency'
        ],
        correctAnswer: 1,
        explanation: 'The height of the spike in A-mode represents the amplitude or strength of the returning echo.'
      }
    ]
  },
  {
    id: 'v7',
    title: 'M-Mode Echocardiogram',
    description: 'Motion mode (M-mode) showing the movement of the mitral valve over time. Excellent for assessing fast-moving structures like heart valves.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mitral_valve_M-mode.jpg/800px-Mitral_valve_M-mode.jpg',
    category: 'Display Modes',
    assessment: [
      {
        id: 'q-v7-1',
        question: 'What is the primary advantage of M-mode?',
        options: [
          'High spatial resolution',
          'High temporal resolution',
          '3D imaging',
          'Color flow mapping'
        ],
        correctAnswer: 1,
        explanation: 'M-mode has very high temporal resolution, making it ideal for tracking rapid motion.'
      }
    ]
  },
  {
    id: 'v8',
    title: 'Spectral Doppler: Carotid Artery',
    description: 'Spectral Doppler waveform of the common carotid artery showing peak systolic and end diastolic velocities.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Carotid_ultrasound.jpg/800px-Carotid_ultrasound.jpg',
    category: 'Doppler',
    assessment: [
      {
        id: 'q-v8-1',
        question: 'What does the x-axis represent in a spectral Doppler display?',
        options: [
          'Velocity',
          'Time',
          'Depth',
          'Amplitude'
        ],
        correctAnswer: 1,
        explanation: 'In spectral Doppler, the x-axis represents time and the y-axis represents velocity (or frequency shift).'
      }
    ]
  },
  {
    id: 'v9',
    title: 'Color Doppler: Cardiac Flow',
    description: 'Color Doppler in an apical 4-chamber view showing blood flow through the mitral and tricuspid valves.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Apical_four_chamber_view.jpg/800px-Apical_four_chamber_view.jpg',
    category: 'Doppler',
    assessment: [
      {
        id: 'q-v9-1',
        question: 'In standard color maps (BART), what does blue represent?',
        options: [
          'Flow toward the transducer',
          'Flow away from the transducer',
          'Turbulent flow',
          'Slow flow'
        ],
        correctAnswer: 1,
        explanation: 'BART stands for Blue Away, Red Toward.'
      }
    ]
  },
  {
    id: 'v10',
    title: 'Edge Shadowing Artifact',
    description: 'Refraction at the curved edges of a circular structure (like a cyst) causes the beam to diverge, creating shadows at the edges.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ultrasound_of_a_normal_kidney.jpg/800px-Ultrasound_of_a_normal_kidney.jpg',
    category: 'Artifacts',
    assessment: [
      {
        id: 'q-v10-1',
        question: 'What physical principle causes edge shadowing?',
        options: [
          'Reflection',
          'Refraction',
          'Scattering',
          'Absorption'
        ],
        correctAnswer: 1,
        explanation: 'Edge shadowing is a refraction artifact occurring at curved boundaries.'
      }
    ]
  },
  {
    id: 'v19',
    title: 'Diaphragm Mirror Image',
    description: 'A classic example of a mirror image artifact. The diaphragm acts as a strong specular reflector, creating a duplicate of the liver parenchyma or a mass above the diaphragm.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ultrasound_mirror_image_artifact.jpg/800px-Ultrasound_mirror_image_artifact.jpg',
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
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gallstone_on_ultrasound.jpg/800px-Gallstone_on_ultrasound.jpg',
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
  },
  {
    id: 'v21',
    title: 'Renal Cyst with Enhancement',
    description: 'A simple renal cyst showing posterior acoustic enhancement. The fluid in the cyst attenuates sound less than the surrounding kidney tissue.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ultrasound_of_a_normal_kidney.jpg/800px-Ultrasound_of_a_normal_kidney.jpg',
    category: 'Artifacts',
    assessment: [
      {
        id: 'q-v21-1',
        question: 'Why does posterior enhancement occur behind a simple cyst?',
        options: ['The cyst reflects more sound', 'The cyst is highly attenuating', 'The cyst is weakly attenuating', 'The cyst refracts the beam'],
        correctAnswer: 2,
        explanation: 'Fluid-filled cysts are weakly attenuating, meaning more sound energy reaches the tissues behind them compared to surrounding tissues.'
      }
    ]
  },
  {
    id: 'v22',
    title: 'Fetal Profile - 20 Weeks',
    description: 'A mid-sagittal view of a fetal profile. This view is used to assess the nasal bone and nuchal translucency.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fetal_ultrasound.jpg/800px-Fetal_ultrasound.jpg',
    category: 'OB/GYN',
    assessment: [
      {
        id: 'q-v22-1',
        question: 'Which of the following is a key landmark in a mid-sagittal fetal profile view?',
        options: ['Stomach', 'Nasal bone', 'Kidneys', 'Bladder'],
        correctAnswer: 1,
        explanation: 'The nasal bone is a critical landmark assessed in the fetal profile view during the second trimester.'
      }
    ]
  },
  {
    id: 'v23',
    title: 'Color Doppler Aliasing',
    description: 'Color Doppler image showing aliasing. Notice the color wrapping from red to blue without passing through the black baseline, indicating the velocity exceeds the Nyquist limit.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/ColourDopplerA.jpg',
    category: 'Doppler',
    assessment: [
      {
        id: 'q-v23-1',
        question: 'How can you correct color aliasing in this image?',
        options: ['Decrease the PRF (scale)', 'Increase the PRF (scale)', 'Increase the frequency', 'Decrease the wall filter'],
        correctAnswer: 1,
        explanation: 'Increasing the PRF (scale) increases the Nyquist limit, which helps resolve aliasing.'
      }
    ]
  },
  {
    id: 'v24',
    title: 'Comet Tail Artifact',
    description: 'A type of reverberation artifact caused by small, highly reflective structures like cholesterol crystals or metal, creating a solid bright line extending downwards.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Comet_tail_artifact_on_ultrasound.jpg/800px-Comet_tail_artifact_on_ultrasound.jpg',
    category: 'Artifacts',
    assessment: [
      {
        id: 'q-v24-1',
        question: 'Comet tail artifact is a specific form of which broader category of artifact?',
        options: ['Refraction', 'Shadowing', 'Reverberation', 'Enhancement'],
        correctAnswer: 2,
        explanation: 'Comet tail is a form of reverberation where the reflective interfaces are very close together.'
      }
    ]
  }
];

export const VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'Ultrasound Physics Basics',
    description: 'A comprehensive overview of sound waves, frequency, and propagation in tissue.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/xtdfCGz6e1Y',
    thumbnail: 'https://img.youtube.com/vi/xtdfCGz6e1Y/hqdefault.jpg',
    duration: '9:07',
    script: `I read through 5 different physics textbooks and 20 hours of lectures for you, so here is the cliffnotes version to save you 30 hours of study time.

But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment. If you can answer these questions by the end, you are officially "educated" on Ultrasound Physics Basics.

**1. The Roadmap**
• Part 1: Definitions (What even is Ultrasound?).
• Part 2: Core Concepts (Frequency, Wavelength, Propagation, and Attenuation).
• Part 3: Practical Application (Choosing the right transducer).
• Part 4: The "Holy Sh*t" Insight (The ultimate trade-off).

**2. What it is NOT**
The easiest way to first define Ultrasound is the given example of what is not Ultrasound. Audible sound is what you hear every day, ranging from 20 Hz to 20,000 Hz. Ultrasound is simply sound waves with frequencies higher than humans can hear—above 20,000 Hz. It is also NOT an electromagnetic wave like an X-ray; it is a mechanical, longitudinal wave that requires a medium to travel through.

**3. The Mnemonic**
Here is a mnemonic in case you can't remember the parameters of a sound wave... just think about "Fat Walruses Play Ping-pong" (Frequency, Wavelength, Period, Propagation speed). These are the core variables we manipulate to get a clear image.

**4. Core Concepts / Crash Course**
- **Frequency (f):** Cycles per second. Higher frequency = better resolution but less penetration.
- **Propagation Speed (c):** How fast sound travels. In soft tissue, it is exactly 1,540 m/s.
- **Attenuation:** The weakening of sound as it travels. It happens through Absorption, Scattering, and Reflection.

**5. The Analogy**
Think of sound propagation through tissue like a crowded concert. If the crowd is tightly packed and stiff (like bone), the "wave" of people pushing each other travels super fast. If the crowd is sparse and squishy (like air or lungs), the wave dissipates and travels slowly. 

**6. Practical Application**
To make this actually all practical, I'm going to show you how to choose the right transducer. If you are scanning a superficial structure like a thyroid, you use a high-frequency linear probe. If you are scanning a deep liver, you use a lower-frequency curvilinear probe. You sacrifice some resolution for the penetration you need.

**7. The "Holy Sh*t" Insight**
The ultimate trade-off in ultrasound is always Penetration vs. Resolution. You cannot have both. This is the fundamental law of ultrasound physics. If you want to see deeper, you must accept a blurrier image.

**8. The Mindset Shift**
Focus on showing up rather than perfection. You do not rise to the level of your goals, you fall to the level of your systems. Build the system of always adjusting your frequency and depth on every single patient.

**9. The Assessment**
As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Ultrasound Physics Basics.
1. What is the average propagation speed of sound in soft tissue?
2. Which of the following is NOT a component of attenuation?
3. As frequency increases, what happens to wavelength?`,
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
      },
      {
        id: 'q1-3',
        question: 'As frequency increases, what happens to wavelength?',
        options: ['Increases', 'Decreases', 'Stays the same', 'Doubles'],
        correctAnswer: 1,
        explanation: 'Wavelength and frequency are inversely proportional (λ = c/f).'
      }
    ]
  },
  {
    id: '2',
    title: 'Doppler Ultrasound Principles',
    description: 'Understanding the Doppler effect, color flow, and spectral Doppler.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/TkjyyzsNpaU',
    thumbnail: 'https://img.youtube.com/vi/TkjyyzsNpaU/hqdefault.jpg',
    duration: '22:10',
    script: `I spent 40 hours analyzing vascular ultrasound cases and reading the core Doppler physics papers for you, so here is the cliffnotes version to save you a week of studying.

But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.

**1. The Roadmap**
• Part 1: Definitions (What even is the Doppler Effect?).
• Part 2: Core Concepts (The Doppler Equation and Aliasing).
• Part 3: Practical Application (Color vs. Spectral Doppler).
• Part 4: The "Holy Sh*t" Insight (The 90-degree trap).

**2. What it is NOT**
The easiest way to first define the Doppler Effect is what it is not. It is not a measurement of the actual speed of blood. It is a measurement of the *change in frequency* of a sound wave when it bounces off moving red blood cells.

**3. The Mnemonic**
Here is a mnemonic in case you can't remember the Doppler Equation variables... just think about "Two Crazy Foxes Velocity Cosine" (2 x Frequency x Velocity x Cosine). This tells you exactly what creates a Doppler shift.

**4. Core Concepts / Crash Course**
- **The Doppler Shift:** Toward the probe = higher frequency. Away = lower frequency.
- **Cosine Theta:** The angle is critical. Cosine of 90 degrees is 0, meaning NO shift is detected.
- **Aliasing:** When high velocity flow "wraps around" the baseline. This happens when the shift exceeds the Nyquist Limit (PRF/2).

**5. The Analogy**
Think of the Doppler angle like a radar gun catching a speeding car. If the car is driving directly at the police officer (0 degrees), the radar gets a perfect read. If the car is driving perfectly sideways past the officer (90 degrees), the radar registers zero speed.

**6. Practical Application**
To make this actually all practical, I'm going to show you how to set up a vascular workflow. Always steer your color box with the angle of the vessel to avoid a 90-degree angle. Keep your spectral Doppler angle at 60 degrees or less.

**7. The "Holy Sh*t" Insight**
If you are exactly perpendicular (90 degrees) to a vessel, your Color Doppler will show no color, and your Spectral Doppler will show a flat line. You might falsely diagnose a total occlusion just because of bad physics!

**8. The Mindset Shift**
You do not rise to the level of your goals, you fall to the level of your systems. Build a system where you automatically check your angle correction before you ever hit "freeze" on a spectral waveform.

**9. The Assessment**
As promised, here is a little assessment.
1. What happens to the Doppler shift at a 90-degree angle?
2. What artifact happens when the Doppler shift exceeds the Nyquist Limit?
3. Which Doppler mode is most sensitive to slow flow?`,
    assessment: [
      {
        id: 'q2-1',
        question: 'What happens to the Doppler shift at a 90-degree angle?',
        options: ['It is maximum', 'It is zero', 'It is negative', 'It is doubled'],
        correctAnswer: 1,
        explanation: 'The cosine of 90 degrees is zero, so no Doppler shift is detected.'
      },
      {
        id: 'q2-2',
        question: 'What artifact happens when the Doppler shift exceeds the Nyquist Limit?',
        options: ['Shadowing', 'Enhancement', 'Aliasing', 'Mirror Image'],
        correctAnswer: 2,
        explanation: 'Aliasing occurs when the frequency shift is greater than half the PRF.'
      },
      {
        id: 'q2-3',
        question: 'Which Doppler mode is most sensitive to slow flow and independent of angle?',
        options: ['Color Doppler', 'Spectral Doppler', 'Power Doppler', 'Continuous Wave Doppler'],
        correctAnswer: 2,
        explanation: 'Power Doppler is highly sensitive to slow flow and does not depend on the Doppler angle.'
      }
    ]
  },
  {
    id: '3',
    title: 'Transducer Anatomy & Function',
    description: 'How piezoelectric crystals work and the different types of ultrasound probes.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/3oVf0r51Fzw',
    thumbnail: 'https://img.youtube.com/vi/3oVf0r51Fzw/hqdefault.jpg',
    duration: '18:45',
    script: `I tore apart three broken ultrasound probes and read the engineering manuals for you, so here is the cliffnotes version to save you 15 hours of technical reading.

But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.

**1. The Roadmap**
• Part 1: Definitions (What even is Piezoelectricity?).
• Part 2: Core Concepts (Anatomy of a transducer).
• Part 3: Practical Application (Choosing the right probe footprint).
• Part 4: The "Holy Sh*t" Insight (The matching layer miracle).

**2. What it is NOT**
The easiest way to first define a transducer is what it is not. It is not just a camera. A camera only receives light. A transducer is both a speaker and a microphone—it sends sound pulses and then listens for the echoes.

**3. The Mnemonic**
Here is a mnemonic in case you can't remember the layers of a transducer... just think about "Big Cats Make Dinners" (Backing material, Crystals, Matching layer, Damping). 

**4. Core Concepts / Crash Course**
- **PZT Crystal:** Converts electricity to sound and vice versa.
- **Matching Layer:** Reduces impedance mismatch between crystal and skin. It is 1/4 wavelength thick.
- **Backing Material:** Dampens the crystal ringing to create short pulses, improving axial resolution.

**5. The Analogy**
Think of the Piezoelectric crystals like a group of dancers. When you hit them with electricity, they physically change shape and vibrate, creating sound waves. Think of the Backing Material like a hand grabbing a ringing cymbal to stop the sound quickly.

**6. Practical Application**
To make this actually all practical, let's look at probe selection. Linear probes for superficial structures, Curved probes for deep structures, and Phased Array probes for cardiac imaging to peek between ribs.

**7. The "Holy Sh*t" Insight**
Without the matching layer and gel, 99% of the sound would reflect off the skin. The matching layer literally makes ultrasound possible by bridging the impedance gap.

**8. The Mindset Shift**
You do not rise to the level of your goals, you fall to the level of your systems. Treat your probes like fragile glass. Build a system of careful handling to avoid cracking the PZT crystals.

**9. The Assessment**
As promised, here is a little assessment.
1. How thick is the matching layer compared to the wavelength?
2. What is the primary purpose of the backing material?
3. Which resolution is improved by shorter pulses?`,
    assessment: [
      {
        id: 'q3-1',
        question: 'How thick is the matching layer compared to the wavelength?',
        options: ['1/2 wavelength', '1/4 wavelength', '1 wavelength', '2 wavelengths'],
        correctAnswer: 1,
        explanation: 'The matching layer is designed to be exactly 1/4 wavelength thick.'
      },
      {
        id: 'q3-2',
        question: 'What is the primary purpose of the backing material?',
        options: ['Increase frequency', 'Dampen crystal ringing', 'Focus the beam', 'Protect the patient'],
        correctAnswer: 1,
        explanation: 'Backing material stops the crystal from ringing, creating shorter pulses.'
      },
      {
        id: 'q3-3',
        question: 'Which resolution is improved by shorter spatial pulse lengths?',
        options: ['Lateral Resolution', 'Axial Resolution', 'Elevational Resolution', 'Temporal Resolution'],
        correctAnswer: 1,
        explanation: 'Axial resolution (LARRD) is improved by shorter pulses.'
      }
    ]
  },
  {
    id: '4',
    title: 'Ultrasound Artifacts Explained',
    description: 'Common imaging artifacts: reverberation, shadowing, enhancement, and more.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/auG2nND0e7w',
    thumbnail: 'https://img.youtube.com/vi/auG2nND0e7w/hqdefault.jpg',
    duration: '25:30',
    script: `I reviewed 500 artifact cases and read the physics guidelines for you, so here is the cliffnotes version to save you 20 hours of confusion.

But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.

**1. The Roadmap**
• Part 1: Definitions (What even is an artifact?).
• Part 2: Core Concepts (Propagation vs. Attenuation Artifacts).
• Part 3: Practical Application (Using artifacts to diagnose).
• Part 4: The "Holy Sh*t" Insight (Artifacts aren't always bad).

**2. What it is NOT**
The easiest way to first define an artifact is what it is not. It is not a real anatomical structure. It is an error in imaging—something on the screen that doesn't actually exist in the body.

**3. The Mnemonic**
Here is a mnemonic in case you can't remember the main artifacts... just think about "Really Silly Elephants Can't Dance" (Reverberation, Shadowing, Enhancement, Comet-tail, Dirty shadowing).

**4. Core Concepts / Crash Course**
- **Shadowing:** Sound hits a highly attenuating structure (stone), leaving a dark area behind.
- **Enhancement:** Sound passes through a weakly attenuating structure (cyst), making the area behind look bright.
- **Mirror Image:** Sound reflects off a strong angled reflector (diaphragm), creating a fake duplicate.

**5. The Analogy**
Think of acoustic shadowing like standing behind a brick wall with a flashlight. The wall blocks the light. Posterior enhancement is like shining a light through a clear glass of water—it passes through so easily that the area behind it looks extra bright.

**6. Practical Application**
To make this actually all practical, I'm going to show you how to use artifacts to your advantage. A shadow proves a stone is real. Enhancement proves a cyst is fluid.

**7. The "Holy Sh*t" Insight**
Artifacts are not your enemy; they are your secret weapon. Without these "errors" in the image, diagnosing pathology would be ten times harder.

**8. The Mindset Shift**
You do not rise to the level of your goals, you fall to the level of your systems. Build a system where your eyes automatically scan the tissue *behind* a structure to check for diagnostic artifacts.

**9. The Assessment**
As promised, here is a little assessment.
1. What artifact is created by sound bouncing between two strong reflectors?
2. What artifact proves that a structure is fluid-filled?
3. Where is the fake duplicate located in a mirror image artifact?`,
    assessment: [
      {
        id: 'q4-1',
        question: 'What artifact is created by sound bouncing between two strong reflectors, creating equally spaced lines?',
        options: ['Shadowing', 'Enhancement', 'Reverberation', 'Refraction'],
        correctAnswer: 2,
        explanation: 'Reverberation is caused by sound bouncing back and forth between two reflectors.'
      },
      {
        id: 'q4-2',
        question: 'What artifact proves that a structure is fluid-filled?',
        options: ['Acoustic Shadowing', 'Posterior Enhancement', 'Mirror Image', 'Edge Shadowing'],
        correctAnswer: 1,
        explanation: 'Posterior enhancement occurs behind weakly attenuating structures like fluid.'
      },
      {
        id: 'q4-3',
        question: 'In a mirror image artifact, where is the fake duplicate located?',
        options: ['Superficial to the reflector', 'Deep to the reflector', 'Inside the reflector', 'To the side of the reflector'],
        correctAnswer: 1,
        explanation: 'The machine places the mirror image deeper than the real structure.'
      }
    ]
  },
  {
    id: '5',
    title: 'Vascular Ultrasound & Hemodynamics',
    description: 'Deep dive into blood flow patterns, pressure gradients, and vascular pathology.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/-jhRhhA62Mo',
    thumbnail: 'https://img.youtube.com/vi/-jhRhhA62Mo/hqdefault.jpg',
    duration: '28:15',
    script: `I spent 50 hours in the clinical vascular lab and read the hemodynamics manuals for you, so here is the cliffnotes version to save you 40 hours of study.

But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment.

**1. The Roadmap**
• Part 1: Definitions (What is Hemodynamics?).
• Part 2: Core Concepts (Bernoulli and Poiseuille).
• Part 3: Practical Application (Measuring stenosis).
• Part 4: The "Holy Sh*t" Insight (The pressure drop paradox).

**2. What it is NOT**
The easiest way to first define Hemodynamics is what it is not. It is not just looking at a vessel. It is understanding the *forces* that move blood.

**3. The Mnemonic**
Here is a mnemonic in case you can't remember Bernoulli's principle... just think about "Pressure Drops When Velocity Soars". This is the key to understanding stenosis.

**4. Core Concepts / Crash Course**
- **Bernoulli's Principle:** As velocity increases (at a stenosis), pressure must decrease to maintain energy.
- **Laminar vs. Turbulent Flow:** Smooth parallel layers vs. chaotic swirling (bruit/thrill).
- **Poiseuille's Law:** Relationship between pressure, resistance, and flow.

**5. The Analogy**
Think of a garden hose. If you put your thumb over the end (creating a stenosis), the water shoots out faster (increased velocity), but the pressure inside the stream actually drops.

**6. Practical Application**
To make this actually all practical, I'm going to show you how to measure Peak Systolic Velocity (PSV). This is the gold standard for grading carotid artery stenosis.

**7. The "Holy Sh*t" Insight**
The pressure is actually *lowest* at the point of highest velocity in a stenosis. This seems backwards, but it's the law of conservation of energy.

**8. The Mindset Shift**
Use the "2-minute rule". If you can't get a good waveform in 2 minutes, adjust your patient's position or your probe angle. Don't fight the physics; work with them.

**9. The Assessment**
As promised, here is a little assessment.
1. According to Bernoulli, what happens to pressure at a stenosis?
2. What type of flow is characterized by chaotic swirling?
3. What is the gold standard measurement for grading carotid stenosis?`,
    assessment: [
      {
        id: 'q5-1',
        question: 'According to Bernoulli\'s Principle, what happens to pressure at the site of a stenosis where velocity is highest?',
        options: ['Pressure increases', 'Pressure decreases', 'Pressure stays the same', 'Pressure fluctuates'],
        correctAnswer: 1,
        explanation: 'Bernoulli\'s Principle states that as velocity increases, pressure must decrease.'
      },
      {
        id: 'q5-2',
        question: 'What type of flow is characterized by chaotic swirling and spectral broadening?',
        options: ['Laminar Flow', 'Plug Flow', 'Turbulent Flow', 'Parabolic Flow'],
        correctAnswer: 2,
        explanation: 'Turbulent flow is chaotic and often seen distal to a stenosis.'
      },
      {
        id: 'q5-3',
        question: 'What is the primary measurement used to grade carotid artery stenosis?',
        options: ['Mean Velocity', 'Peak Systolic Velocity (PSV)', 'End Diastolic Velocity', 'Volume Flow'],
        correctAnswer: 1,
        explanation: 'PSV is the primary metric for grading carotid stenosis.'
      }
    ]
  },
  {
    id: '6',
    title: 'Ultrasound Bioeffects & Safety',
    description: 'Understanding Thermal and Mechanical Indices (TI and MI) and the ALARA principle.',
    citation: 'Source: Radiology Tutorials',
    embedUrl: 'https://www.youtube.com/embed/R_7_O-0-7_Y',
    thumbnail: 'https://img.youtube.com/vi/R_7_O-0-7_Y/hqdefault.jpg',
    duration: '15:45',
    script: `I reviewed the AIUM and FDA safety guidelines for you, so here is the cliffnotes version to save you 10 hours of regulatory reading.

**1. The Roadmap**
• Part 1: Thermal Index (TI).
• Part 2: Mechanical Index (MI).
• Part 3: The ALARA Principle.

**2. Core Concepts**
- **TI:** Relates to the potential for tissue heating. Keep it below 1.0 for most exams.
- **MI:** Relates to cavitation (bubble formation). Keep it low, especially in lung and bowel.
- **ALARA:** As Low As Reasonably Achievable. Use the minimum power and time needed for a diagnosis.`,
    assessment: [
      {
        id: 'q6-1',
        question: 'What does the ALARA principle stand for?',
        options: [
          'Always Look At Real Anatomy',
          'As Low As Reasonably Achievable',
          'Acoustic Levels Are Really Awesome',
          'All Levels Are Reasonably Acceptable'
        ],
        correctAnswer: 1,
        explanation: 'ALARA stands for As Low As Reasonably Achievable, emphasizing safety.'
      }
    ]
  }
];
