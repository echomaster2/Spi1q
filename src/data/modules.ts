import { 
  Waves, Radio, Zap, Activity, AlertTriangle, ShieldCheck, 
  HeartPulse, FlaskConical, Target as TargetIcon, Sparkles, 
  Monitor, Cpu, Database, BarChart3
} from 'lucide-react';
import { Module } from '../types';

export const modules: Module[] = [
  { title: "Waves and Sound", weight: "15%", icon: Waves, color: "from-registry-teal/80 to-registry-teal", lessons: [{ title: "The Nature of Sound", id: "1.1" }, { title: "Essential Wave Parameters", id: "1.2" }, { title: "Interaction with Media", id: "1.3" }] },
  { title: "Transducers", weight: "20%", icon: Radio, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Piezoelectric Anatomy", id: "2.1" }, { title: "Array Types", id: "2.2" }, { title: "Beam Focusing", id: "2.3" }] },
  { title: "Pulsed Wave", weight: "10%", icon: Zap, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Pulse-Echo Principle", id: "3.1" }, { title: "Pulsed Wave Parameters", id: "3.2" }] },
  { title: "Doppler Effect", weight: "15%", icon: Activity, color: "from-registry-teal to-registry-cobalt", lessons: [{ title: "The Doppler Principle", id: "4.1" }, { title: "Doppler Modalities", id: "4.2" }, { title: "Doppler Artifacts", id: "4.3" }] },
  { title: "Imaging Artifacts", weight: "10%", icon: AlertTriangle, color: "from-registry-amber to-registry-rose", lessons: [{ title: "Propagation Artifacts", id: "5.1" }, { title: "Attenuation Artifacts", id: "5.2" }] },
  { title: "Bioeffects & Safety", weight: "5%", icon: ShieldCheck, color: "from-stealth-800 to-stealth-950", lessons: [{ title: "ALARA & Mechanisms", id: "6.1" }, { title: "Safety Indices", id: "6.2" }, { title: "Patient Care & Ergonomics", id: "6.3" }] },
  { title: "Hemodynamics", weight: "10%", icon: HeartPulse, color: "from-registry-rose to-registry-cobalt", lessons: [{ title: "Flow Patterns", id: "7.1" }, { title: "Physical Principles", id: "7.2" }, { title: "Venous Hemodynamics", id: "7.3" }] },
  { title: "Quality Assurance", weight: "5%", icon: FlaskConical, color: "from-registry-teal to-stealth-800", lessons: [{ title: "QA Principles", id: "8.1" }, { title: "Phantoms & Testing", id: "8.2" }] },
  { title: "Spatial Resolution", weight: "5%", icon: TargetIcon, color: "from-registry-cobalt to-registry-cobalt", lessons: [{ title: "Axial Resolution", id: "9.1" }, { title: "Lateral Resolution", id: "9.2" }, { title: "Elevational Resolution", id: "9.3" }] },
  { title: "Harmonics", weight: "5%", icon: Sparkles, color: "from-registry-teal to-registry-teal", lessons: [{ title: "Non-Linear Propagation", id: "10.1" }, { title: "Tissue Harmonic Imaging", id: "10.2" }] },
  { title: "Instrumentation", weight: "10%", icon: Monitor, color: "from-stealth-800 to-registry-teal", lessons: [{ title: "System Components", id: "11.1" }, { title: "Receiver Functions", id: "11.2" }, { title: "Display Modes", id: "11.3" }, { title: "Image Processing", id: "11.4" }] },
  { title: "Advanced Modalities", weight: "5%", icon: Cpu, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "Elastography & Contrast", id: "12.1" }, { title: "Pulse Inversion", id: "12.2" }] },
  { title: "Statistical Analysis", weight: "5%", icon: BarChart3, color: "from-registry-rose to-registry-rose", lessons: [{ title: "Diagnostic Accuracy", id: "13.1" }, { title: "Sensitivity & Specificity", id: "13.2" }, { title: "Reliability & Bias", id: "13.3" }] },
  { title: "Digital Workflow", weight: "5%", icon: Database, color: "from-registry-teal to-registry-cobalt", lessons: [{ title: "The Scan Converter", id: "14.1" }, { title: "PACS & DICOM", id: "14.2" }, { title: "Cloud Integration", id: "14.3" }] },
  { title: "Specialized Probes", weight: "5%", icon: Cpu, color: "from-registry-cobalt to-registry-teal", lessons: [{ title: "TEE & Specialized Probes", id: "15.1" }, { title: "Intraoperative & Laparoscopic", id: "15.2" }] },
  { title: "Clinical Datasets", weight: "5%", icon: Database, color: "from-registry-teal to-registry-cobalt", lessons: [{ title: "Breast Ultrasound (BUSI)", id: "16.1" }, { title: "Echocardiography (EchoNet)", id: "16.2" }, { title: "Echo Segmentation (MIMIC)", id: "16.3" }, { title: "OB/GYN Samples", id: "16.4" }] },
  { title: "Math & Exam Review", weight: "5%", icon: FlaskConical, color: "from-registry-rose to-registry-teal", lessons: [{ title: "Metrics & Logs", id: "17.1" }, { title: "Decibels (dB)", id: "17.2" }] }
];
