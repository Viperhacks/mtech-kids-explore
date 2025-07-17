export type GradeKey =
  | 'ECD'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'

export interface SubjectStats {
  subjectId: number
  videoCount: number
  quizCount: number
}

export interface GradeConfig {
  id: string
  subjects: SubjectStats[]
}

export const curriculumConfig: Record<GradeKey, GradeConfig> = {
  ECD: {
    id: 'ecd',
    subjects: [
      { subjectId: 1, videoCount: 3, quizCount: 1 }, 
      { subjectId: 2, videoCount: 2, quizCount: 1 }, 
    ]
  },
  "Grade 1": {
    id: 'grade1',
    subjects: [
      { subjectId: 1, videoCount: 5, quizCount: 2 },
      { subjectId: 2, videoCount: 4, quizCount: 2 }, 
    ]
  },
  "Grade 2": {
    id: 'grade2',
    subjects: [
      { subjectId: 1, videoCount: 6, quizCount: 3 },
      { subjectId: 2, videoCount: 5, quizCount: 2 },
      { subjectId: 5, videoCount: 4, quizCount: 2 }, 
    ]
  },
  "Grade 3": {
    id: 'grade3',
    subjects: [
      { subjectId: 1, videoCount: 8, quizCount: 5 }, 
      { subjectId: 2, videoCount: 6, quizCount: 4 }, 
      { subjectId: 3, videoCount: 7, quizCount: 3 }, 
      { subjectId: 5, videoCount: 5, quizCount: 2 },
    ]
  },
  "Grade 4": {
    id: 'grade4',
    subjects: [
      { subjectId: 1, videoCount: 10, quizCount: 6 },
      { subjectId: 2, videoCount: 8, quizCount: 5 },
      { subjectId: 3, videoCount: 9, quizCount: 4 },
      { subjectId: 5, videoCount: 7, quizCount: 3 },
    ]
  },
  "Grade 5": {
    id: 'grade5',
    subjects: [
      { subjectId: 1, videoCount: 12, quizCount: 7 },
      { subjectId: 2, videoCount: 10, quizCount: 6 },
      { subjectId: 3, videoCount: 11, quizCount: 5 },
      { subjectId: 5, videoCount: 9, quizCount: 4 },
      { subjectId: 4, videoCount: 6, quizCount: 3 }, 
    ]
  },
  "Grade 6": {
    id: 'grade6',
    subjects: [
      { subjectId: 1, videoCount: 14, quizCount: 8 },
      { subjectId: 2, videoCount: 12, quizCount: 7 },
      { subjectId: 3, videoCount: 13, quizCount: 6 },
      { subjectId: 5, videoCount: 11, quizCount: 5 },
      { subjectId: 4, videoCount: 8, quizCount: 4 },
      { subjectId: 6, videoCount: 7, quizCount: 3 }, 
    ]
  },
  "Grade 7": {
    id: 'grade7',
    subjects: [
      { subjectId: 1, videoCount: 16, quizCount: 9 },
      { subjectId: 2, videoCount: 14, quizCount: 8 },
      { subjectId: 3, videoCount: 15, quizCount: 7 },
      { subjectId: 5, videoCount: 13, quizCount: 6 },
      { subjectId: 4, videoCount: 10, quizCount: 5 },
      { subjectId: 6, videoCount: 9, quizCount: 4 },
      
    ]
  },
}
