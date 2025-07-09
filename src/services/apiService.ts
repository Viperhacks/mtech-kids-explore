import api, { 
  authService, 
  resourceService, 
  quizService, 
  trackingService, 
  adminService, 
  teacherService
} from '@/lib/api';


import { PaginatedResponse, Student } from '@/components/types/apiTypes';
/*
// Authentication services
export const login = async (email: string, password: string) => {
  try {
    const response = await authService.login(email, password);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    const response = await authService.register(userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await authService.forgotPassword(email);
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await authService.resetPassword(token, password);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const confirmOtp = async (email: string, otp: string) => {
  try {
    const response = await authService.confirmOtp(email, otp);
    return response.data;
  } catch (error) {
    console.error('OTP confirmation error:', error);
    throw error;
  }
};*/

// Resource services
export const getResources = async (grade?: string, subject?: string) => {
  try {
    const response = await resourceService.getResources(grade, subject);
    return response.data;
  } catch (error) {
    console.error('Get resources error:', error);
    throw error;
  }
};

export const getResourcesForQuiz = async () => {
  try {
    const response = await resourceService.getResourcesForQuiz();
    return response.data;
  } catch (error) {
    console.error('Get resources error:', error);
    throw error;
  }
};

export const getResourcesForAnyOne = async (grade?: string, subject?: string) => {
  try {
    const response = await resourceService.getResourcesForStudent(grade, subject);
    return response.data || response;
  } catch (error) {
    console.error('Get resources error:', error);
    throw error;
  }
};

export const uploadResource = async (resourceData: FormData | any) => {
  try {
    const response = await resourceService.uploadResource(resourceData);
    return response.data;
  } catch (error) {
    console.error('Upload resource error:', error);
    throw error;
  }
};

export const getResourceById = async (id: string) => {
  try {
    const response = await resourceService.getResourceById(id);
    return response.data;
  } catch (error) {
    console.error('Get resource error:', error);
    throw error;
  }
};

export const updateResource = async (id: string, data: any) => {
  try {
    const response = await resourceService.updateResource(id, data);
    return response.data;
  } catch (error) {
    console.error('Update resource error:', error);
    throw error;
  }
};

export const deleteResource = async (id: string) => {
  try {
    const response = await resourceService.deleteResource(id);
    return response.data;
  } catch (error) {
    console.error('Delete resource error:', error);
    throw error;
  }
};

// Quiz services
export const getQuizzes = async (gradeId?: string, subjectId?: string) => {
  try {
    const response = await quizService.getQuizzes(gradeId, subjectId);
    console.log("response from api: ",response)
    return response.data;
  } catch (error) {
    console.error('Get quizzes error:', error);
    throw error;
  }
};

export const startQuiz = async (quizId: string) => {
  try {
    const response = await quizService.startQuiz(quizId);
    return response.data;
  } catch (error) {
    console.error('Start quiz error:', error);
    throw error;
  }
};

export const submitQuiz = async (quizId: string, answers: any) => {
  try {
    const response = await quizService.submitQuiz(quizId, answers);
    return response.data;
  } catch (error) {
    console.error('Submit quiz error:', error);
    throw error;
  }
};

// Quiz management services
export const createQuiz = async (quizData: any) => {
  try {
    const response = await api.post('/quiz', quizData);
    return response;
  } catch (error) {
    console.error('Create quiz error:', error);
    throw error;
  }
};

export const updateQuiz = async (quizId: string, quizData: any) => {
  try {
    const response = await api.put(`/quiz/${quizId}`, quizData);
    return response;
  } catch (error) {
    console.error('Update quiz error:', error);
    throw error;
  }
};

export const getAllQuizzes = async () => {
  try {
    const response = await api.get('/quiz/all');
    return response;
  } catch (error) {
    console.error('Get all quizzes error:', error);
    throw error;
  }
};

export const deleteQuiz = async (quizId: string) => {
  try {
    const response = await api.delete(`/quiz/${quizId}`);
    return response;
  } catch (error) {
    console.error('Delete quiz error:', error);
    throw error;
  }
};

export const uploadQuestions = async (quizId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/question/upload?id=${quizId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.error('Upload questions error:', error);
    throw error;
  }
};

export const getQuizQuestions = async (quizId: string) => {
  try {
    const response = await api.get(`/question/${quizId}`);
    return response;
  } catch (error) {
    console.error('Get quiz questions error:', error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await api.delete(`/question/${questionId}`);
    return response;
  } catch (error) {
    console.error('Delete question error:', error);
    throw error;
  }
};


export const submitQuizAttempt = async (quizId: string, score: number, total: number) => {
  try {
    const response = await api.post(`/attempt/${quizId}?score=${score}&total=${total}`);
    return response.data;
  } catch (error) {
    console.error('Submit quiz score error:', error);
    throw error;
  }

};


// Tracking services
export const trackActivity = async (activityData: any) => {
  try {
    const response = await trackingService.trackActivity(activityData);
    return response.data;
  } catch (error) {
    console.error('Track activity error:', error);
    // Silently fail for tracking to not disrupt user experience
    return null;
  }
};

export const trackMediaProgress = async (userId: string, resourceId: string | number, mediaType: string, progress: number, completed: boolean) => {
  try {
    const response = await trackingService.trackActivity({
      userId,
      type: `${mediaType}_progress`,
      resourceId: resourceId.toString(),
      progress,
      completed,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error(`Track ${mediaType} progress error:`, error);
    // Silently fail for tracking
    return null;
  }
};

export const getUserProgress = async (userId: string) => {
  try {
    const response = await trackingService.getUserProgress(userId);
    return response.data;
  } catch (error) {
    console.error('Get user progress error:', error);
    throw error;
  }
};

export const getUserStats = async (userId: string) => {
  try {
    const response = await trackingService.getUserStats(userId);
    return response.data;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

export const getUserBadges = async (userId: string) => {
  try {
    const response = await trackingService.getUserBadges(userId);
    return response.data;
  } catch (error) {
    console.error('Get user badges error:', error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const response = await trackingService.getSystemStats();
    return response.data;
  } catch (error) {
    console.error('Get system stats error:', error);
    throw error;
  }
};

export const getActiveUsers = async (period: string = 'day') => {
  try {
    const response = await trackingService.getActiveUsers(period);
    return response.data;
  } catch (error) {
    console.error('Get active users error:', error);
    throw error;
  }
};


// Admin services
export const getAllUsers = async (page: number = 1, limit: number = 10, filters?: any) => {
  try {
    const response = await adminService.getAllUsers(page, limit, filters);
    //console.log("response from api: ", response)
    return response; // Response is already unwrapped by axios interceptor
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

export const getAllStudents = async (): Promise<any> => {
  try {
    const response = await api.get('/teacher/students');
    return response; // Response is already unwrapped by axios interceptor
  } catch (error) {
    console.error('Get all students error:', error);
    throw error;
  }
};

export const getTotalStats = async()=>{
  try {
    const response = await adminService.getTotalStats();
    return response.data;
  } catch (error) {
     console.error('Get total stats error:', error);
    throw error;
  }
}

export const getResourceStats = async () => {
  try {
    const response = await adminService.getResourceStats();
    return response.data;
  } catch (error) {
    console.error('Get resource stats error:', error);
    throw error;
  }
};

export const getActivityLogs = async (filters?: any) => {
  try {
    const response = await adminService.getActivityLogs(filters);
    return response.data;
  } catch (error) {
    console.error('Get activity logs error:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await adminService.updateUserRole(userId, role);
    return response.data;
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
};

export const getUsageMetrics = async (timeRange: string = 'week') => {
  try {
    const response = await trackingService.getSystemStats();
    // Mock data for now since the actual endpoint structure may vary
    return {
      data: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        newUsers: Math.floor(Math.random() * 10) + 5,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        sessions: Math.floor(Math.random() * 100) + 50,
        avgSessionTime: Math.floor(Math.random() * 30) + 10,
        resourceViews: Math.floor(Math.random() * 200) + 100,
        quizStarts: Math.floor(Math.random() * 50) + 25,
        quizCompletions: Math.floor(Math.random() * 30) + 15
      }))
    };
  } catch (error) {
    console.error('Get usage metrics error:', error);
    throw error;
  }
};

// Assignment management services
export const createAssignment = async (
  teacherId: number,
  classroomId: number,
  subjectId?: number,
  subjectName?: string
) => {
  try {
    const response = await adminService.createAssignment({ teacherId, classroomId, subjectId, subjectName });
    return response.data || response;
  } catch (error) {
    console.error('Create assignment error:', error);
    throw error;
  }
};


export const getClassroomAssignments = async (classId: string) => {
  try {
    const response = await adminService.getClassroomAssignments(classId);
    return response.data || response;
  } catch (error) {
    console.error('Get classroom assignments error:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    const response = await adminService.deleteAssignment(assignmentId);
    return response.data || response;
  } catch (error) {
    console.error('Delete assignment error:', error);
    throw error;
  }
};

export const getTeachers = async (page: number = 1, limit: number = 10, filters?: any) => {
  try {
   
    const response = await adminService.getTeachers(page, limit, filters);
    return response.data || response;
  } catch (error) {
    console.error('Get teachers error:', error);
    throw error;
  }
};

export const getTeachersForAssignment = async () => {
  try {
   
    const response = await adminService.getTeachersForAssignments();
    return response.data || response;
  } catch (error) {
    console.error('Get teachers error:', error);
    throw error;
  }
};

// Student quiz attempts

export const getStudentAttempts = async (page: number = 0, limit: number = 10) => {

  try {
    const response = await api.get('/attempt/student', { params: { page, limit } });
    return response.data || response;
  } catch (error) {
    console.error('Get student attempts error:', error);
    throw error;
  }
};

// Teacher - Get all attempts for a specific quiz
export const getQuizAttempts = async (quizId: string, page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get(`/attempt/quiz/${quizId}`, { params: { page, limit } });
    return response.data || response;
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    throw error;
  }
};

// Classroom management services
export const getClassrooms = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get('/classrooms', { params: { page, limit } });
    return response.data || response;
  } catch (error) {
    console.error('Get classrooms error:', error);
    throw error;
  }
};

export const getClassroomById = async (id: string) => {
  try {
    const response = await api.get(`/classrooms/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Get classroom error:', error);
    throw error;
  }
};

export const createClassroom = async (classroomData: { name: string; gradeLevel: string }) => {
  try {
    const response = await api.post('/classrooms', classroomData);
    return response.data || response;
  } catch (error) {
    console.error('Create classroom error:', error);
    throw error;
  }
};

export const updateClassroom = async (id: string, classroomData: { name: string; gradeLevel: string }) => {
  try {
    const response = await api.put(`/classrooms/${id}`, classroomData);
    return response.data || response;
  } catch (error) {
    console.error('Update classroom error:', error);
    throw error;
  }
};

export const deleteClassroom = async (id: string) => {
  try {
    const response = await api.delete(`/classrooms/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Delete classroom error:', error);
    throw error;
  }
};

// Admin content management services
export const getAllQuizzesAdmin = async () => {
  try {
    const response = await adminService.getAllQuizzes();
    return response.data || response;
  } catch (error) {
    console.error('Get all quizzes admin error:', error);
    throw error;
  }
};

export const deleteQuizAdmin = async (id: string) => {
  try {
    const response = await adminService.deleteQuiz(id);
    return response.data || response;
  } catch (error) {
    console.error('Delete quiz admin error:', error);
    throw error;
  }
};

export const getAdminResources = async (page: number = 0, size: number = 10) => {
  try {
    const response = await adminService.getAdminResources(page, size);
    return response.data || response;
  } catch (error) {
    console.error('Get admin resources error:', error);
    throw error;
  }
};

export const deleteResourceAdmin = async (id: string) => {
  try {
    const response = await resourceService.deleteResource(id);
    return response.data || response;
  } catch (error) {
    console.error('Delete resource admin error:', error);
    throw error;
  }
};

export const getAllAttemptsAdmin = async (page: number = 0, size: number = 10) => {
  try {
    const response = await adminService.getAllAttempts(page, size);
    return response.data || response;
  } catch (error) {
    console.error('Get all attempts admin error:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await adminService.deleteUser(id);
    return response.data || response;
  } catch (error) {
    console.error('Delete user  error:', error);
    throw error;
  }
};


