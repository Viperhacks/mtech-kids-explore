
import api, { 
  authService, 
  resourceService, 
  quizService, 
  trackingService, 
  parentService, 
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

export const getResourcesForAnyOne = async (grade?: string, subject?: string) => {
  try {
    const response = await resourceService.getResourcesForStudent(grade, subject);
    return response.data;
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

// Parent services
export const connectToStudent = async (parentId: string, studentEmail: string) => {
  try {
    const response = await parentService.connectToStudent(parentId, studentEmail);
    return response.data;
  } catch (error) {
    console.error('Connect to student error:', error);
    throw error;
  }
};

export const getStudentData = async (studentId: string) => {
  try {
    const response = await parentService.getStudentData(studentId);
    return response.data;
  } catch (error) {
    console.error('Get student data error:', error);
    throw error;
  }
};

export const getConnectedStudents = async (parentId: string) => {
  try {
    const response = await parentService.getConnectedStudents(parentId);
    return response.data;
  } catch (error) {
    console.error('Get connected students error:', error);
    throw error;
  }
};

// Admin services
export const getAllUsers = async (page: number = 1, limit: number = 10, filters?: any) => {
  try {
    const response = await adminService.getAllUsers(page, limit, filters);
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

export const getAllStudents = async (): Promise<PaginatedResponse<Student>> => {
  try {
    const response = await api.get('/teacher/students');

    // Check if 'content' exists in the response
    if (!response.data || !response.data.content) {
      throw new Error('Missing content in API response');
    }

    // Now safely return the response
    return response.data; // This will return the entire data including 'content'
  } catch (error) {
    console.error('Get all students error:', error);
    throw error;
  }
};



export const getUsageMetrics = async (period: string = 'week') => {
  try {
    const response = await adminService.getUsageMetrics(period);
    return response.data;
  } catch (error) {
    console.error('Get usage metrics error:', error);
    throw error;
  }
};

// Renamed from getUserStats to getAdminUserStats to avoid duplicate declaration
export const getAdminUserStats = async () => {
  try {
    const response = await adminService.getUserStats();
    return response.data;
  } catch (error) {
    console.error('Get admin user stats error:', error);
    throw error;
  }
};

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
