export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Mastered";
export type GCSEGrade = "U" | "G" | "F" | "E" | "D" | "C" | "B" | "A" | "A_STAR";
export type AssessmentType = "Quiz" | "Test" | "Homework" | "Exam" | "Practice";

export interface MathChapter {
  id: number;
  name: string;
  progress: number; // 0-100
  mastery: SkillLevel;
  subtopics?: MathSubTopic[];
}

export interface MathSubTopic {
  id: number;
  name: string;
  progress: number;
  mastery: SkillLevel;
  difficulty: "Foundation" | "Higher";
}

export interface AssessmentResult {
  id: number;
  chapter: string;
  score: number; // 0-100
  date: string;
  type: AssessmentType;
  feedback?: string;
}

export interface Student {
  id: number;
  name: string;
  grade: string; // Year 10, Year 11, etc.
  email: string;
  targetGrade: GCSEGrade;
  currentGrade: GCSEGrade;
  chapters: MathChapter[];
  recentAssessments: AssessmentResult[];
  attendance?: number; // percentage
  studyHours?: number; // per week
}

export interface GCSEChapterStructure {
  id: number;
  name: string;
  description: string;
  difficulty: "Foundation" | "Higher" | "Both";
  weightage: number; // percentage in final exam
  subtopics: string[];
  examQuestions: number;
  estimatedHours: number;
}

export interface ProgressAnalytics {
  overallProgress: number;
  chapterProgress: Record<string, number>;
  gradePrediction: GCSEGrade;
  weakAreas: string[];
  strongAreas: string[];
  improvementRate: number;
  targetGap: number; // gap to target grade
}
