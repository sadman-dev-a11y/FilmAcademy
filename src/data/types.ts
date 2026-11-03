export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  minutes: number;
  objectives: string[];
  sections: { title: string; text: string }[];
  example: string;
  terms: string[];
  checks: Question[];
  task: string;
  diagram: "frame" | "exposure" | "axis" | "sequence" | "sound" | "research";
  takeaway: string;
}
export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  level: "Beginner" | "Intermediate";
  summary: string;
  color: string;
  icon: string;
  objectives: string[];
  references: { title: string; url: string }[];
  lessons: Lesson[];
  quiz: Question[];
}
