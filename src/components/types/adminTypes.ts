
export interface AdminQuiz {
  quizId: string;
  title: string;
  description: string;
  grade: string;
  subject: string;
  standaAlone: boolean;
  teacherName: string;
  createdAt: string;
  resource?: string;
}

export interface AdminResource {
  response: any;
  id: string;
  title: string;
  type: 'VIDEO' | 'DOCUMENT';
  grade: string;
  subject: string;
  content: string;
  thumbnailPath?: string;
  createdAt: string;
  teacher?: string;
}

export interface AdminAttempt {
  id: string;
  userFullName: string;
  quizTitle: string;
  score: number;
  total: number;
  attemptedAt: string;
  quizId: string;
  grade?: string;
  subject?: string;
}


export interface AdminUserResponseDto {
  fullName: string;
  username: string;
  gradeLevel?: string | null;
  assignedLevels?: string[] | null;
  role: 'STUDENT';
  id: number;
  createdAt: string; 
}
