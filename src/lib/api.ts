import axios from 'axios';
import { PaginatedResponse, Student } from '@/components/types/apiTypes';
import { toast } from 'sonner';


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

      toast(
        "Oops! Your session timed out. Let’s log you back in to keep learning!",
        {
          duration: 4000
        }
      );
      setTimeout(() => {

  window.location.href = '/?auth=expired';
}, 2000);

      return new Promise(() => {}); // hang the promise to avoid further errors
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth services
export const authService = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),

  register: (fullName: string, username: string, password: string, confirmPassword: string, role: 'STUDENT' | 'TEACHER' | 'PARENT', gradeLevel?: string) => 
    api.post(`/auth/register?role=${role}`, { 
      fullName, 
      username, 
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
  getResources: (grade?: string, subject?: string) => 
    api.get('/resources/my-resources', { params: { grade, subject } }),
   getResourcesForQuiz: (grade?: string, subject?: string) => 
    api.get('/resources/for-quiz'),
  getResourcesForStudent: (grade?: string, subject?: string) => 
    api.get('/resources', { params: { grade, subject } }),
  uploadResource: (resourceData: FormData | any) => {
    if (resourceData instanceof FormData) {
      return api.post('/resources', resourceData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      return api.post('/resources', resourceData);
    }
  },
  getResourceById: (id: string) => api.get(`/resources/${id}`),
  deleteResource: (id: string) => api.delete(`/resources/${id}`),
  updateResource: (id: string, data: any) => {
    if(data instanceof FormData){
      return api.put(`/resources/${id}`, data,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }else {
      return api.put(`/resources/${id}`, data);
    }
  },
  getCompletedResources: ()=> api.get('/users/resources/completed'),
  markResourceCompleted: (resourceId: number, type: string)=> api.post(`/users/resources/complete?resourceId=${resourceId}&type=${type}`),
};

// Quiz services
export const quizService = {
  getQuizzes: (gradeId?: string, subjectId?: string) => 
    api.get('/quizzes', { params: { gradeId, subjectId } }),
  startQuiz: (quizId: string) => api.post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId: string, answers: any) => api.post(`/quizzes/${quizId}/submit`, { answers }),
  createQuiz: (quizData: any) => api.post('/quizzes', quizData),
};



// Admin services
export const adminService = {
  getTotalStats: () => api.get('/admin/users/stats'),
  getResourceStats: () => api.get('/admin/stats/resources'),
  getActivityLogs: (filters?: any) => api.get('/admin/logs', { params: filters }),
  updateUserRole: (userId: string, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
  getAllUsers: (page: number = 1, limit: number = 10, filters?: any) => 
    api.get('/admin/users', { params: { page, limit, ...filters } }),
  getTeachersForAssignments: () => api.get('/admin/users/teachers'),
  getTeachers: (page: number = 1, limit: number = 10, filters?: any) => api.get('/admin/users/teachers',{ params: { page, limit, ...filters } }),
  createAssignment: (assignmentData: {
  teacherId: number;
  classroomId: number;
  subjectId?: number;
  subjectName?: string;
}) => api.post('/assignments', assignmentData),
  deleteUser: (id:string)=> api.delete(`/admin/users/${id}`),
  getClassroomAssignments: (classId: string) => api.get(`/assignments/classroom/${classId}`),
  deleteAssignment: (assignmentId: string) => api.delete(`/assignments/${assignmentId}`),
  
  // New admin content management endpoints
  getAllQuizzes: () => api.get('/quiz/all'),
  deleteQuiz: (id: string) => api.delete(`/quiz/${id}`),
  updateQuiz: (id: string, data: any) => api.put(`/quiz/${id}`, data),
  getAdminResources: (page: number = 0, size: number = 10) => 
    api.get('/admin/users/resource', { params: { page, size } }),
  getAllAttempts: (page: number = 0, size: number = 10) => 
    api.get('/attempt/all', { params: { page, size } }),

  getStudentsCreatedByTeacher: (teacherId: string, page: number = 0, size: number = 10) =>
  api.get(`/admin/users/teacher/${teacherId}/created-students`, { params: { page, size } }),

};

// Teacher services
export const teacherService = {
  getAllStudents: async (): Promise<PaginatedResponse<Student>> => {
    try {
      const { data } = await api.get('/teacher/students');
  
      // Log the response for inspection
      console.log('API Raw Response:', data);
  
      if (!data || !Array.isArray(data.content)) {
        throw new Error('Invalid API response structure');
      }
  
      return data;
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  },  

  getStudentProgress: async (studentId: string) => {
    try {
      const response = await api.get(`/teacher/students/${studentId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Get student progress error:', error);
      throw error;
    }
  },

 
};

export default api;
