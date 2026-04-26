
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
  description?: string;
  content: React.ReactNode;
  quiz?: AdvancedQuestion; // Upgraded to AdvancedQuestion
  narrationScript?: string;
  clinicalImages?: { url: string; caption: string }[];
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
  date: string; // ISO string
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
  aiExplainer?: string;
  relatedLessonIds?: string[];
}

export interface DailyQuizState {
  date: string; // YYYY-MM-DD
  questions: Quiz[];
  completed: boolean;
  score?: number;
  answers?: number[];
}

export interface Scenario {
  id: string;
  part: number;
  category: string;
  scenario: string;
  answer: string;
}

export interface UserProfile {
  uid?: string;
  name?: string;
  email?: string;
  dailyInsight: string;
  lastInsightTimestamp: number;
  scriptVault: { id: string; title: string; content: string; timestamp: number }[];
  registryDate?: string; // YYYY-MM-DD
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
  visualOverrides?: Record<string, { id: string; type: 'image' | 'video' | 'stock' | 'gif'; data: string }>;
  lexiconOverrides?: Record<string, { id: string; type: 'image' | 'video' | 'stock' | 'gif'; data: string }>;
  lexiconAIExplainers?: Record<string, string>;
  hasCompletedOnboarding?: boolean;
  volume?: number;
  isPrivateMode?: boolean;
  lastManualSync?: number;
  examHistory?: ExamResults[];
  harveyInteractionCount?: number;
  studyTimeTotal?: number; // in seconds
  diagnosticAccuracy?: number;
  streak?: number;
  scenariosCompleted?: string[];
  textScale?: number;
  createdAt?: any;
  updatedAt?: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface ProgressData {
  lessonId: string;
  moduleId: string;
  completed: boolean;
  score?: number;
  lastAccessed: any;
  attempts?: number;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
