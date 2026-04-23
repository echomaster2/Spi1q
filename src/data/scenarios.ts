import { Scenario } from '../../types';

export const scenarios: Scenario[] = [
  // Part 1: Ultrasound Physics Principles
  {
    id: 's1-1',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are performing an abdominal ultrasound on a patient. Based on the principles of thermal bioeffects, where would you expect the largest temperature rise in tissue to occur?',
    answer: 'The highest temperatures tend to occur in tissue in the region between where the ultrasound beam enters the tissue and the focal region.'
  },
  {
    id: 's1-2',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'A sonographer is performing an ultrasound. They want to ensure the best diagnostic information is obtained while keeping total ultrasound exposure to the patient as low as reasonably achievable. What is this guiding principle called?',
    answer: 'This principle is called ALARA, which stands for "as low as reasonably achievable".'
  },
  {
    id: 's1-3',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are conducting an ultrasound examination and need to determine the exposure time. What is the primary factor that determines how quickly you can obtain a useful image and thus the length of the examination?',
    answer: 'Primarily, it is your training, education, and experience that determine how quickly a useful image can be obtained, influencing the length of the examination and exposure.'
  },
  {
    id: 's1-4',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You notice that the far field of your ultrasound image appears too dark. To correct this and brighten the image, what is the recommended first adjustment you should make?',
    answer: 'You should increase the receiver gain.'
  },
  {
    id: 's1-5',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'A sound wave with an initial intensity of 2 mW/cm² undergoes a change of +9 dB. What is the final intensity of the wave?',
    answer: 'The final intensity will be 16 mW/cm². (An increase of 3 dB doubles the intensity, so +9 dB is 2x2x2 = 8 times the original intensity. 2 mW/cm² * 8 = 16 mW/cm²).'
  },
  {
    id: 's1-6',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are comparing two tissues. Tissue A has an acoustic impedance of 1.5 Mrayls, and Tissue B also has an impedance of 1.5 Mrayls. If a sound wave strikes the boundary between them at a 90-degree angle, what percentage of the intensity will be transmitted?',
    answer: 'If the impedances of the two media are identical, 100% of the intensity will be transmitted, and there will be no reflection.'
  },
  {
    id: 's1-7',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are given a specific ultrasound wave and are told it is infrasonic. What can you immediately infer about its frequency?',
    answer: 'Infrasound is defined as an acoustic wave with a frequency less than 20 Hz.'
  },
  {
    id: 's1-8',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'A sound beam travels a total distance of 10 cm in 2 seconds. What is the propagation speed of this sound wave?',
    answer: 'The speed of the sound is 5 cm/sec (10 cm / 2 sec = 5 cm/sec).'
  },
  {
    id: 's1-9',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are asked to identify a material with a high acoustic impedance coefficient. Which of the following states of matter generally possesses a higher acoustic impedance coefficient?',
    answer: 'Solids generally have a higher acoustic impedance coefficient.'
  },
  {
    id: 's1-10',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'An ultrasound image displays a region described as "hyperechoic." What does this term indicate about the echoes returning from that region?',
    answer: 'A hyperechoic region is echogenic, meaning it produces echoes.'
  },
  {
    id: 's1-11',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You need to recall the average velocity of ultrasound in soft tissue. What is this value?',
    answer: 'The average velocity of ultrasound in soft tissue is 1540 meters per second.'
  },
  {
    id: 's1-12',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'While adjusting system controls, you increase the output gain. How does this action directly affect the acoustic exposure to the patient?',
    answer: 'Increasing the output gain increases the acoustic exposure to the patient.'
  },
  {
    id: 's1-13',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are explaining the phenomenon of tissue heating during an ultrasound exam. What is the primary process by which tissue heats as ultrasound travels through it?',
    answer: 'The primary reason tissue heats as sound is attenuated in the human body is absorption, where acoustic energy is converted into heat.'
  },
  {
    id: 's1-14',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'If the amplitude of a sound wave is halved, what immediate effect does this have on its intensity?',
    answer: 'If the amplitude of a signal is halved, the resulting intensity is one fourth the original intensity.'
  },
  {
    id: 's1-15',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are asked about the typical frequency range used for diagnostic ultrasound imaging. What is this range?',
    answer: 'The typical range of frequency for diagnostic ultrasound imaging is 1 to 20 MHz.'
  },
  {
    id: 's1-16',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You observe that the Pulse Repetition Frequency (PRF) of your ultrasound system increases. What consistent effect does this have on the duty factor?',
    answer: 'If the PRF increases, the duty factor increases.'
  },
  {
    id: 's1-17',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are calculating the attenuation coefficient for a 6.0 MHz ultrasound beam in soft tissue. What is the approximate value for this?',
    answer: 'The attenuation coefficient in soft tissue is approximately one half of the operating frequency, so for 6.0 MHz, it\'s about 3 dB/cm.'
  },
  {
    id: 's1-18',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You need to describe the percentage of time that the ultrasound system is producing pulses of ultrasound. What is the term for this?',
    answer: 'This describes the duty factor.'
  },
  {
    id: 's1-19',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are analyzing how sound travels through different media. If only the density of a medium is increased, what happens to the propagation speed within that medium?',
    answer: 'If only the density of a medium is increased, the propagation speed will decrease because density and propagation speed are inversely related.'
  },
  {
    id: 's1-20',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You observe a strong, echo-free region appearing directly behind a weakly attenuating structure on your ultrasound image. What useful artifact is this demonstrating?',
    answer: 'This is an example of enhancement, a useful artifact seen behind weakly attenuating structures.'
  },
  {
    id: 's1-21',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'A sonographer is using a 3 MHz transducer and increases the output power to visualize deeper structures. No other controls are adjusted. What happens to the spatial pulse length?',
    answer: 'The spatial pulse length remains the same, as it is a characteristic of the pulse itself and is inherent in the transducer system\'s design, not affected by output power.'
  },
  {
    id: 's1-22',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are asked for the unit of measurement for pressure as an acoustic variable. What is the appropriate unit?',
    answer: 'Pressure is typically expressed in Pascals (Pa).'
  },
  {
    id: 's1-23',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'What type of wave is sound fundamentally considered to be?',
    answer: 'Sound is technically a mechanical and longitudinal wave.'
  },
  {
    id: 's1-24',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'When the power in an acoustic beam is doubled and the cross-sectional area of the beam is halved, what happens to the intensity of the beam?',
    answer: 'The intensity rises to four times its original value.'
  },
  {
    id: 's1-25',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You need to determine how many different shades of gray can be stored with 4 bits of memory.',
    answer: 'With 4 bits of memory, 16 different shades of gray can be stored (2^4 = 16).'
  },
  {
    id: 's1-26',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'What is the specific term used to describe the redirection of the sound beam in many directions from a reflector that is small relative to the wavelength?',
    answer: 'This phenomenon is called Rayleigh scattering.'
  },
  {
    id: 's1-27',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are presented with a graph showing two variables where, as the value of the x-variable (temperature) increases, the value of the y-variable (clothing) decreases. What type of relationship do these variables have?',
    answer: 'This describes an inverse relationship.'
  },
  {
    id: 's1-28',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'What is the minimum radiation dose threshold that typically results in epilation?',
    answer: 'The minimum radiation dose threshold that typically results in epilation is 3 Gy.'
  },
  {
    id: 's1-29',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'You are analyzing the fundamental properties that define sound waves. Which of the following is considered an acoustic variable?',
    answer: 'Density is an acoustic variable.'
  },
  {
    id: 's1-30',
    part: 1,
    category: 'Ultrasound Physics Principles',
    scenario: 'What does the Output Display Standard (ODS) aim to achieve?',
    answer: 'The goal of the ODS is to make users aware of the actual output of their ultrasound equipment as it is being used, providing real-time information about the potential for bioeffects.'
  },

  // Part 2: Transducers & Imaging Components
  {
    id: 's2-1',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'You are evaluating the performance of an ultrasound system\'s resolution. In clinical imaging, which type of resolution is generally considered to be the best?',
    answer: 'Axial resolution is best in clinical imaging.'
  },
  {
    id: 's2-2',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'You are selecting a transducer and want to increase the near zone length. Which combination of transducer characteristics would achieve this?',
    answer: 'A large crystal diameter and high frequency would increase the near zone length.'
  },
  {
    id: 's2-3',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What is the primary purpose of the matching layer in an ultrasound transducer?',
    answer: 'The matching layer facilitates the transmission of sound from the element into the patient’s skin by stepping down the impedance.'
  },
  {
    id: 's2-4',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'You are observing the effects of damping material on a transducer. What is the main effect damping material has on the spatial pulse length (SPL)?',
    answer: 'Damping material reduces (decreases) the spatial pulse length.'
  },
  {
    id: 's2-5',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'You are examining a transducer with elements arranged in a concentric pattern. What type of transducer is this?',
    answer: 'This describes an annular array transducer.'
  },
  {
    id: 's2-6',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which type of transducer is characterized by mechanically sweeping the piezoelectric elements to steer the beam?',
    answer: 'A mechanical transducer uses a motor or mechanical sweeping to steer the beam.'
  },
  {
    id: 's2-7',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What effect does the damping material have on the quality factor (Q-factor) of a transducer?',
    answer: 'Damping material decreases the quality factor.'
  },
  {
    id: 's2-8',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'If you need to image deep structures in the abdomen, which type of transducer would typically be best utilized due to its penetration capabilities?',
    answer: 'A curved sequenced array transducer would be best utilized for imaging deep structures in the abdomen.'
  },
  {
    id: 's2-9',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What happens to an ultrasound transducer if it undergoes heat sterilization?',
    answer: 'Heat sterilization kills pathogens but unfortunately destroys the transducer.'
  },
  {
    id: 's2-10',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which type of transducer has a higher Q-factor: therapeutic or imaging transducers?',
    answer: 'Therapeutic transducers have a higher Q-factor than imaging transducers.'
  },
  {
    id: 's2-11',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which specific type of transducer is no longer used for imaging?',
    answer: 'Annular array transducers are no longer used for imaging.'
  },
  {
    id: 's2-12',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What term describes the range of frequencies present within the sound beam?',
    answer: 'This is defined as the bandwidth.'
  },
  {
    id: 's2-13',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What is the minimum number of active elements that a mechanical transducer typically has?',
    answer: 'The minimum number of active elements in a mechanical transducer is 1.'
  },
  {
    id: 's2-14',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What is the typical voltage range of the signal produced by the pulser that excites a piezoelectric crystal?',
    answer: 'The signal typically produced by the pulser is in the range of hundreds of volts.'
  },
  {
    id: 's2-15',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What is the purpose of attaching backing material to the piezoelectric element in an imaging transducer?',
    answer: 'The backing material shortens the pulse by decreasing the number of cycles in a pulse.'
  },
  {
    id: 's2-16',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'You are troubleshooting an image display. What type of video display is limited to only black and white, with no other shades of gray?',
    answer: 'A display limited to only black and white, with no other shades of gray, is called bistable.'
  },
  {
    id: 's2-17',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'In a standard cathode ray tube (CRT) used to display ultrasound images, what are the charged particles that are emitted from a "gun" at the rear of the tube?',
    answer: 'The charged particles emitted are electrons.'
  },
  {
    id: 's2-18',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'With 6 bits of memory, what is the largest number of different shades of gray that can be stored?',
    answer: 'With 6 bits, the largest number of different shades of gray that can be stored is 64 (2^6).'
  },
  {
    id: 's2-19',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which ultrasound mode is primarily used to measure distance, often representing the depth of the signal in the horizontal dimension?',
    answer: 'A-Mode is mainly used to measure distance, representing the depth of the signal in the horizontal dimension.'
  },
  {
    id: 's2-20',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which mode in ultrasound imaging is primarily interested in documenting the movement of reflectors along one scan line, such as heart valve motion?',
    answer: 'M-mode (motion mode) is used when documentation of the movement of a reflector is needed.'
  },
  {
    id: 's2-21',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'In M-mode imaging, what type of information is typically represented along the x-axis of the display?',
    answer: 'Time is along the x-axis of an M-mode image.'
  },
  {
    id: 's2-22',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What is the smallest component of a 3D image?',
    answer: 'The smallest component of a 3D image is the voxel.'
  },
  {
    id: 's2-23',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What technique uses made-up pixel information to replace areas between scan lines where there is no actual signal information?',
    answer: 'This technique is called fill-in interpolation.'
  },
  {
    id: 's2-24',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'Which part of the ultrasound machine does NOT affect the amount of energy entering the patient?',
    answer: 'The receiver does not affect the amount of energy entering the patient.'
  },
  {
    id: 's2-25',
    part: 2,
    category: 'Transducers & Imaging Components',
    scenario: 'What system component is responsible for timing the reception of the pulses to determine their location?',
    answer: 'The master synchronizer is responsible for timing the reception of the pulses to determine their location.'
  },

  // Part 3: Hemodynamics & Doppler Principles
  {
    id: 's3-1',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'You are performing a spectral Doppler examination and notice aliasing. You increase the PRF/scale setting. What effect does this have on the potential for aliasing?',
    answer: 'Increasing the PRF/scale setting decreases the potential of aliasing.'
  },
  {
    id: 's3-2',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'Under what angle of insonation is the Doppler shift highest?',
    answer: 'The Doppler shift is highest when the beam is parallel (0 degrees) to the direction of flow.'
  },
  {
    id: 's3-3',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'At what Reynolds number does turbulence typically begin to be predicted?',
    answer: 'The point at which the Reynolds number predicts turbulence is 2000.'
  },
  {
    id: 's3-4',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'A patient is standing upright. Where in their body would the hydrostatic pressure be highest?',
    answer: 'In a standing patient, the hydrostatic pressure is highest in the feet.'
  },
  {
    id: 's3-5',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'What mathematical processing technique is used to analyze Doppler data and produce a spectral waveform display?',
    answer: 'Fast Fourier transform (FFT) is the mathematical processing technique used for spectral waveforms.'
  },
  {
    id: 's3-6',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'In a spectral Doppler display, what does the brightness of the dots that make up the display represent?',
    answer: 'The brightness of the dots represents the number of red blood cells present.'
  },
  {
    id: 's3-7',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'You want to add more spectral Doppler waveforms to the display screen. What setting on the machine should you adjust?',
    answer: 'You should adjust the sweep speed.'
  },
  {
    id: 's3-8',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'Which type of Doppler modality does not rely on the frequency shift but instead relies on the strength or amplitude of the shift?',
    answer: 'Power Doppler does not rely on frequency shift but on the strength of the shift.'
  },
  {
    id: 's3-9',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'What is the duty factor of Continuous Wave (CW) Doppler?',
    answer: 'The duty factor for continuous wave ultrasound is 100% or 1.'
  },
  {
    id: 's3-10',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'You are using a Pulsed Wave (PW) Doppler device. What is the fewest number of crystals such a device may have?',
    answer: 'A PW Doppler device may have one crystal.'
  },
  {
    id: 's3-11',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'You are performing an ultrasound on a patient. What happens to venous return to the heart when an individual inhales?',
    answer: 'Upon inspiration (inhaling), venous return to the heart increases.'
  },
  {
    id: 's3-12',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'You are observing venous flow in the legs. What happens to venous flow in the legs when an individual inhales?',
    answer: 'Upon inspiration (inhaling), venous flow in the legs decreases.'
  },
  {
    id: 's3-13',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'What happens to the diaphragm when an individual breathes in?',
    answer: 'Upon inspiration (breathing in), the diaphragm moves downward into the abdomen.'
  },
  {
    id: 's3-14',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'What is the typical range of Doppler shift frequencies found in diagnostic imaging examinations?',
    answer: 'The typical range of Doppler shift found in diagnostic imaging examinations is between 20 Hz and 20 kHz (in the audible range).'
  },
  {
    id: 's3-15',
    part: 3,
    category: 'Hemodynamics & Doppler Principles',
    scenario: 'What phenomenon occurs when very high velocities appear negative in a Doppler display?',
    answer: 'This phenomenon is called aliasing.'
  },

  // Part 4: Quality Assurance & Patient Care
  {
    id: 's4-1',
    part: 4,
    category: 'Quality Assurance & Patient Care',
    scenario: 'As a sonographer, you are responsible for maintaining the ultrasound equipment. How often must comprehensive preventative maintenance be performed at minimum?',
    answer: 'Comprehensive preventative maintenance must be performed at least semiannually.'
  },
  {
    id: 's4-2',
    part: 4,
    category: 'Quality Assurance & Patient Care',
    scenario: 'You need to evaluate the flow direction, depth capability, and accuracy of sample volume location for a Doppler system. Which specific test object would you use for this purpose?',
    answer: 'The Doppler phantom is used for these evaluations.'
  },
  {
    id: 's4-3',
    part: 4,
    category: 'Quality Assurance & Patient Care',
    scenario: 'What is considered the most effective way to prevent the spread of infection in a clinical setting?',
    answer: 'Hand washing is the most effective way to prevent the spread of infection.'
  },
  {
    id: 's4-4',
    part: 4,
    category: 'Quality Assurance & Patient Care',
    scenario: 'Which form of cavitation has the most potential for inducing biologic damage?',
    answer: 'Transient cavitation has the most potential for inducing biologic damage because it involves the bursting of microbubbles, leading to shock waves and local temperature increases.'
  },
  {
    id: 's4-5',
    part: 4,
    category: 'Quality Assurance & Patient Care',
    scenario: 'You are about to perform a sonographic procedure. Beyond simply asking the patient their name, what specific information from the patient\'s wristband should you verify for proper patient identification?',
    answer: 'You should verify the patient’s name, medical record number, and date of birth from their wristband.'
  }
];
