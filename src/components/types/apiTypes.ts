export interface Student {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  gradeLevel: string;
  role: string;
  createdAt?: string;
  lastActive?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}


export interface Quiz {
  questions: boolean;
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  standaAlone: boolean;
  teacherName: string;
  
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerPosition: number;
  type: QuestionType;
  correctAnswerText:string;

}

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";



export interface Teacher {
  id: string;
  fullName: string;
  username: string;
  gradeLevel?: string | null;
  assignedLevels?: string[] | null;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  createdAt: number[]; // [2025, 7, 9]
}
