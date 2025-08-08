import { getToken } from '@/lib/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchGrades = async () => {
  const response = await fetch(`${API_BASE_URL}/grades`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const fetchSubjectsByGrade = async (gradeId: number) => {
  const response = await fetch(`${API_BASE_URL}/grades/${gradeId}/subjects`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const fetchResourcesBySubject = async (gradeId: number, subjectId: number) => {
  const response = await fetch(`${API_BASE_URL}/grades/${gradeId}/subjects/${subjectId}/resources`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const fetchResourceDetails = async (resourceId: number) => {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const updateResourceCompletion = async (resourceId: number, completionStatus: boolean) => {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/completion`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ completed: completionStatus })
  });
  return response.json();
};

export const fetchUser = async () => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const uploadQuestions = async (questions: any[]) => {
  const response = await fetch(`${API_BASE_URL}/questions/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ questions })
  });
  return response.json();
};

export const getQuizAttempts = async (quizId: number) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/attempts`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getResourcesForQuiz = async () => {
  const response = await fetch(`${API_BASE_URL}/resources/for-quiz`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const deleteQuestion = async (questionId: number) => {
  const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const startQuiz = async (quizId: number) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getStudentAttempts = async (studentId: number) => {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/attempts`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getAllQuizzesAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/quizzes`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const deleteQuizAdmin = async (quizId: number) => {
  const response = await fetch(`${API_BASE_URL}/admin/quiz/${quizId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getAdminResources = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/resources`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const deleteResourceAdmin = async (resourceId: number) => {
  const response = await fetch(`${API_BASE_URL}/admin/resource/${resourceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getAllAttemptsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/attempts`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getClassroomAssignments = async () => {
  const response = await fetch(`${API_BASE_URL}/classroom/assignments`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const deleteAssignment = async (assignmentId: number) => {
  const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getClassrooms = async () => {
  const response = await fetch(`${API_BASE_URL}/classrooms`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const createClassroom = async (classroomData: any) => {
  const response = await fetch(`${API_BASE_URL}/classrooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(classroomData)
  });
  return response.json();
};

export const updateClassroom = async (classroomId: number, classroomData: any) => {
  const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(classroomData)
  });
  return response.json();
};

export const deleteClassroom = async (classroomId: number) => {
  const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getTeachersForAssignment = async () => {
  const response = await fetch(`${API_BASE_URL}/teachers/for-assignment`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const createAssignment = async (assignmentData: any) => {
  const response = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(assignmentData)
  });
  return response.json();
};

export const getStudentsCreatedByTeacher = async (teacherId: number) => {
  const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}/students`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const deleteUser = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getTeachers = async () => {
  const response = await fetch(`${API_BASE_URL}/teachers`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getActiveUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users/active`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const getUsageMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/metrics/usage`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};
