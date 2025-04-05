
import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'https://emall-backend.onrender.com/api',
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
  (response) => response,
  (error) => {
    // Handle common errors like 401, 403, etc.
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('mtech_user');
      // You could redirect to login or dispatch an action
      window.location.href = '/?auth=expired';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  confirmOtp: (email: string, otp: string) => api.post('/auth/confirm-otp', { email, otp }),
};

// Resource services
export const resourceService = {
  getResources: (gradeId?: string, subjectId?: string) => 
    api.get('/resources', { params: { gradeId, subjectId } }),
  uploadResource: (resourceData: FormData) => 
    api.post('/resources/upload', resourceData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
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
};

export default api;
