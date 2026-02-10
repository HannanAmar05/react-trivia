export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple" | "boolean";

export interface Category {
  id: number;
  name: string;
}

export interface QuizResultProps {
  questions: Question[];
  userAnswers: string[];
  onReset: (toHome?: boolean) => void;
}

export interface CategoryResponse {
  trivia_categories: Category[];
}

export interface Question {
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: string[];
  timeLeft: number;
  isFinished: boolean;
  isStarted: boolean;
  savedQuestions: Question[];
}

export interface QuizConfig {
  amount: number;
  category: number;
  difficulty?: Difficulty;
  type?: QuestionType;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
}
