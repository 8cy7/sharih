export interface Chapter {
  id: string;
  title: string;
  subjectName: string;
  originalFileName: string;
  extractedText: string;
  totalLessons: number;
  processingStatus: "uploading" | "extracting" | "splitting" | "processing" | "partial_ready" | "complete" | "failed";
  processingError: string | null;
  lessonIds: string[];
  createdAt: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  lessonNumber: number;
  titleEn: string;
  titleAr: string;
  isPart: boolean;
  parentTopic: string | null;
  partNumber: number | null;
  totalParts: number | null;
  lessonTextAr: string;
  videoScript: string;
  videoUrl: string | null;
  audioUrl: string | null;
  sceneConfig: SceneConfig[];
  processingStatus: "pending" | "generating_content" | "rendering_media" | "complete" | "failed";
  durationSeconds: number | null;
  createdAt: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionText: string;
  questionType: "mcq" | "true_false";
  options: string[];
  correctAnswer: string;
  explanationAr: string;
}

export interface QuizAttempt {
  id: string;
  visitorId: string;
  lessonId: string;
  answers: {
    selectedAnswer: string;
    confidence: "confident" | "uncertain" | "guessed";
  }[];
  score: number;
  passed: boolean;
  strongTopics: string[];
  weakTopics: string[];
  attemptedAt: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type SceneConfig = DefaultSceneConfig;

// This represents the dynamic types of scenes the AI can request
export interface DefaultSceneConfig {
  type: "title" | "bullets" | "definition" | "comparison" | "flowchart" | "example" | "summary" | "quiz_intro" | string;
  [key: string]: any;
}
