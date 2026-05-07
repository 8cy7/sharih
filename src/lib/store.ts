import { Chapter, Lesson, Quiz, ChatMessage, QuizAttempt } from './types';

const globalForStore = globalThis as unknown as {
  chaptersStore?: Map<string, Chapter>;
  lessonsStore?: Map<string, Lesson>;
  quizzesStore?: Map<string, Quiz>;
  chatHistoryStore?: Map<string, ChatMessage[]>;
  quizAttemptsStore?: Map<string, QuizAttempt>;
};

export const chaptersStore =
  globalForStore.chaptersStore ?? (globalForStore.chaptersStore = new Map<string, Chapter>());
export const lessonsStore =
  globalForStore.lessonsStore ?? (globalForStore.lessonsStore = new Map<string, Lesson>());
export const quizzesStore =
  globalForStore.quizzesStore ?? (globalForStore.quizzesStore = new Map<string, Quiz>());
export const chatHistoryStore =
  globalForStore.chatHistoryStore ?? (globalForStore.chatHistoryStore = new Map<string, ChatMessage[]>());
export const quizAttemptsStore =
  globalForStore.quizAttemptsStore ?? (globalForStore.quizAttemptsStore = new Map<string, QuizAttempt>());
