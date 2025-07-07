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
}