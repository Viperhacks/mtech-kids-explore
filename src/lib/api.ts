import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/?auth=expired';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth services
export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),

  register: (fullName: string, email: string, password: string, confirmPassword: string, role: 'STUDENT' | 'TEACHER' | 'PARENT', gradeLevel?: string) => 
    api.post(`/auth/register?role=${role}`, { 
      fullName, 
      email, 
      password,
      confirmPassword,
      gradeLevel 
    }),

  confirmOtp: (email: string, otp: string) => 
    api.post(`/auth/confirm-otp?email=${email}&otp=${otp}`),

  requestOtp: (email: string) => 
    api.post(`/auth/request-otp?email=${email}`),

  forgotPassword: (email: string) => 
    api.post(`/auth/forgot-password?email=${email}`),

  resetPassword: (token: string, newPassword: string) => 
    api.post(`/auth/reset-password?token=${token}`, { newPassword }),

  refreshToken: (refreshToken: string) => 
    api.post(`/auth/refresh-token?refreshToken=${refreshToken}`),
};

// Resource services
export const resourceService = {
  getResources: (gradeId?: string, subjectId?: string) => 
    api.get('/resources', { params: { gradeId, subjectId } }),
  uploadResource: (resourceData: FormData | any) => {
    if (resourceData instanceof FormData) {
      return api.post('/resources/upload', resourceData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      return api.post('/resources', resourceData);
    }
  },
  getResourceById: (id: string) => api.get(`/resources/${id}`),
  deleteResource: (id: string) => api.delete(`/resources/${id}`),
  updateResource: (id: string, data: any) => api.put(`/resources/${id}`, data),
};

// Quiz services
export const quizService = {
  getQuizzes: (gradeId?: string, subjectId?: string) => 
    api.get('/quizzes', { params: { gradeId, subjectId } }),
  startQuiz: (quizId: string) => api.post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId: string, answers: any) => api.post(`/quizzes/${quizId}/submit`, { answers }),
  createQuiz: (quizData: any) => api.post('/quizzes', quizData),
};

// Progress tracking services
export const trackingService = {
  trackActivity: (activityData: any) => api.post('/tracking/activity', activityData),
  getUserProgress: (userId: string) => api.get(`/tracking/progress/${userId}`),
  getCompletedLessons: (userId: string) => api.get(`/tracking/completed/${userId}`),
  // New endpoints for user tracking
  trackPageView: (userId: string, data: any) => api.post(`/tracking/pageview`, { userId, ...data }),
  trackHeartbeat: (userId: string) => api.post(`/tracking/heartbeat`, { userId, timestamp: new Date().toISOString() }),
  trackSession: (userId: string, duration: number) => 
    api.post(`/tracking/session`, { userId, duration, endTime: new Date().toISOString() }),
  getUserStats: (userId: string) => api.get(`/users/${userId}/activity-stats`),
  getUserBadges: (userId: string) => api.get(`/users/${userId}/badges`),
  getSystemStats: () => api.get('/admin/system-stats'),
  getActiveUsers: (period: string = 'day') => api.get(`/admin/active-users`, { params: { period } }),
};

// Parent-student connection services
export const parentService = {
  connectToStudent: (parentId: string, studentEmail: string) => 
    api.post('/parents/connect', { parentId, studentEmail }),
  getStudentData: (studentId: string) => api.get(`/parents/student/${studentId}`),
  getConnectedStudents: (parentId: string) => api.get(`/parents/${parentId}/students`),
};

// Admin services
export const adminService = {
  getUserStats: () => api.get('/admin/stats/users'),
  getResourceStats: () => api.get('/admin/stats/resources'),
  getActivityLogs: (filters?: any) => api.get('/admin/logs', { params: filters }),
  updateUserRole: (userId: string, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
  getAllUsers: (page: number = 1, limit: number = 10, filters?: any) => 
    api.get('/admin/users', { params: { page, limit, ...filters } }),
  getUsageMetrics: (period: string = 'week') => api.get(`/admin/metrics/usage`, { params: { period } }),
};

export default api;
