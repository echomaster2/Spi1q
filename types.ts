
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type QuestionType = 'mcq' | 'labeling' | 'scenario' | 'formula';

export interface AdvancedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ
  correctAnswer?: number | string | string[]; 
  explanation: string;
  moduleId?: string;
  visualContext?: React.ReactNode; // The visual element to display alongside the question
  labelData?: { x: number, y: number, label: string, id: string }[]; // For labeling
  formulaParts?: { text: string, isBlank: boolean, key?: string }[]; // For formula
  correctFormula?: Record<string, string>;
  scenarioImage?: string;
  lessonLink?: string; // ID for navigation back
}

export interface Lesson {
  id: string;
  title: string;
}

export interface Module {
  title: string;
  weight: string;
  icon: LucideIcon;
  color: string;
  lessons: Lesson[];
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  moduleId?: string;
}

export interface LessonData {
  title: string;
  content: React.ReactNode;
  quiz?: AdvancedQuestion; // Upgraded to AdvancedQuestion
  narrationScript?: string;
}

export interface LessonContentMap {
  [key: string]: LessonData;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Win {
  id: string;
  lessonTitle: string;
  timestamp: Date;
  encouragement: string;
  type?: 'lesson' | 'exam';
}

export interface ExamQuestion extends Quiz {
  moduleTitle: string;
}

export interface ExamResults {
  score: number;
  total: number;
  timeTaken: number;
  moduleBreakdown: {
    [title: string]: { correct: number; total: number };
  };
  passed: boolean;
}

export interface StudyReminder {
  id: string;
  time: string; // HH:mm format
  enabled: boolean;
  days: number[]; // 0-6 (Sun-Sat)
}

export interface Flashcard {
  _id?: string;
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
  frontVisual?: React.ReactNode;
  moduleId: string;
  repetition: number;
  interval: number; // in days
  easeFactor: number;
  nextReview: number; // timestamp
  tags?: string[];
  isPictureCard?: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  visual?: React.ReactNode;
  clinicalPearl?: string;
}

export interface DailyQuizState {
  date: string; // YYYY-MM-DD
  questions: Quiz[];
  completed: boolean;
  score?: number;
  answers?: number[];
}

export interface UserProfile {
  name?: string;
  email?: string;
  dailyInsight: string;
  lastInsightTimestamp: number;
  scriptVault: { id: string; title: string; content: string; timestamp: number }[];
  birthDate?: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  activityHistory?: { date: string; count: number }[]; // History of lessons completed per day
  studyPlan?: {
    techniques: string[];
    schedule: { day: number; topics: string[] }[];
    spiritualWindows: { start: string; end: string; label: string; type: 'favorable' | 'unfavorable' }[];
  };
  studyGoals?: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  aiPersonalizedPlan?: string;
  photoUrl?: string;
  profileAvatar?: 'default' | 'sonographer' | 'student' | 'doctor' | 'nurse';
  companionSkin?: 'default' | 'neon' | 'stealth' | 'golden' | 'sonographer' | 'student';
  volume?: number;
  isPrivateMode?: boolean;
  lastManualSync?: number;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
