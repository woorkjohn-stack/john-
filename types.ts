export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuizState {
  questions: Question[];
  title: string;
  description: string;
}

export type ViewMode = 'create' | 'preview' | 'take' | 'result';

export enum Difficulty {
  EASY = 'سهل',
  MEDIUM = 'متوسط',
  HARD = 'صعب',
}
