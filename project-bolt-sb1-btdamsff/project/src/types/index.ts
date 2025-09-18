export interface Note {
  id: string;
  text: string;
  highlight: string;
  timestamp: Date;
  subject: string;
  language: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: Date;
  score?: number;
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  language: string;
  pronunciation?: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  tasks: StudyTask[];
  completed: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
}

export interface UserProgress {
  level: number;
  xp: number;
  streak: number;
  totalStudyTime: number;
  badges: Badge[];
  studySessions: StudySession[];
}