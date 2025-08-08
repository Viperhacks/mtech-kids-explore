
import { PaginatedResponse, Student } from '@/components/types/apiTypes';
import { getApi } from './useApi';

// Auth services
export const authService = {
  login: (username: string, password: string) => 
    getApi().post('/auth/login', { username, password }),

  register: (fullName: string, username: string, password: string, confirmPassword: string, role: 'STUDENT' | 'TEACHER' | 'PARENT', gradeLevel?: string) => 
    getApi().post(`/auth/register?role=${role}`, { 
      fullName, 
      username, 
      password,
      confirmPassword,
      gradeLevel 
    }),

  confirmOtp: (email: string, otp: string) => 
    getApi().post(`/auth/confirm-otp?email=${email}&otp=${otp}`),

  requestOtp: (email: string) => 
    getApi().post(`/auth/request-otp?email=${email}`),

  forgotPassword: (email: string) => 
    getApi().post(`/auth/forgot-password?email=${email}`),

  resetPassword: (token: string, newPassword: string) => 
    getApi().post(`/auth/reset-password?token=${token}`, { newPassword }),

  refreshToken: (refreshToken: string) => 
    getApi().post(`/auth/refresh-token?refreshToken=${refreshToken}`),
};

// Resource services
export const resourceService = {
  getResources: (grade?: string, subject?: string) => 
    getApi().get('/resources/my-resources', { params: { grade, subject } }),
   getResourcesForQuiz: (grade?: string, subject?: string) => 
    getApi().get('/resources/for-quiz'),
  getResourcesForStudent: (grade?: string, subject?: string) => 
    getApi().get('/resources', { params: { grade, subject } }),
  uploadResource: (resourceData: FormData | any) => {
    if (resourceData instanceof FormData) {
      return getApi().post('/resources', resourceData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      return getApi().post('/resources', resourceData);
    }
  },
  getResourceById: (id: string) => getApi().get(`/resources/${id}`),
  deleteResource: (id: string) => getApi().delete(`/resources/${id}`),
  updateResource: (id: string, data: any) => {
    if(data instanceof FormData){
      return getApi().put(`/resources/${id}`, data,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }else {
      return getApi().put(`/resources/${id}`, data);
    }
  },
  getCompletedResources: ()=> getApi().get('/users/resources/completed'),
  markResourceCompleted: (resourceId: number, type: string)=> getApi().post(`/users/resources/complete?resourceId=${resourceId}&type=${type}`),
};

// Quiz services
export const quizService = {
  getQuizzes: (gradeId?: string, subjectId?: string) => 
    getApi().get('/quizzes', { params: { gradeId, subjectId } }),
  startQuiz: (quizId: string) => getApi().post(`/quizzes/${quizId}/start`),
  submitQuiz: (quizId: string, answers: any) => getApi().post(`/quizzes/${quizId}/submit`, { answers }),
  createQuiz: (quizData: any) => getApi().post('/quizzes', quizData),
};



// Admin services
export const adminService = {
  getTotalStats: () => getApi().get('/admin/users/stats'),
  getResourceStats: () => getApi().get('/admin/stats/resources'),
  getActivityLogs: (filters?: any) => getApi().get('/admin/logs', { params: filters }),
  updateUserRole: (userId: string, role: string) => getApi().put(`/admin/users/${userId}/role`, { role }),
  getAllUsers: (page: number = 1, limit: number = 10, filters?: any) => 
    getApi().get('/admin/users', { params: { page, limit, ...filters } }),
  getTeachersForAssignments: () => getApi().get('/admin/users/teachers'),
  getTeachers: (page: number = 1, limit: number = 10, filters?: any) => getApi().get('/admin/users/teachers',{ params: { page, limit, ...filters } }),
  createAssignment: (assignmentData: {
  teacherId: number;
  classroomId: number;
  subjectId?: number;
  subjectName?: string;
}) => getApi().post('/assignments', assignmentData),
  deleteUser: (id:string)=> getApi().delete(`/admin/users/${id}`),
  getClassroomAssignments: (classId: string) => getApi().get(`/assignments/classroom/${classId}`),
  deleteAssignment: (assignmentId: string) => getApi().delete(`/assignments/${assignmentId}`),
  
  // New admin content management endpoints
  getAllQuizzes: () => getApi().get('/quiz/all'),
  deleteQuiz: (id: string) => getApi().delete(`/quiz/${id}`),
  updateQuiz: (id: string, data: any) => getApi().put(`/quiz/${id}`, data),
  getAdminResources: (page: number = 0, size: number = 10) => 
    getApi().get('/admin/users/resource', { params: { page, size } }),
  getAllAttempts: (page: number = 0, size: number = 10) => 
    getApi().get('/attempt/all', { params: { page, size } }),

  getStudentsCreatedByTeacher: (teacherId: string, page: number = 0, size: number = 10) =>
  getApi().get(`/admin/users/teacher/${teacherId}/created-students`, { params: { page, size } }),

};

export const teacherService = {
  getAllStudents: async (): Promise<PaginatedResponse<Student>> => {
    try {
      const { data } = await getApi().get('/teacher/students');
  
      console.log('getApi() Raw Response:', data);
  
      if (!data || !Array.isArray(data.content)) {
        throw new Error('Invalid getApi() response structure');
      }
  
      return data;
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  },

  getStudentProgress: async (studentId: string) => {
    try {
      const response = await getApi().get(`/teacher/students/${studentId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Get student progress error:', error);
      throw error;
    }
  },

 getTeacherSubjects: async (): Promise<string[]> => {
  try {
    const response = await getApi().get('/teacher/subjects');
    console.log('Fetched teacher subjects:', response);

    const subjects = response.data || response;  // make sure you're accessing data properly

    if (!Array.isArray(subjects)) {
      throw new Error('Invalid subjects response');
    }

    // If "All Subjects" is in the list, return only that
    if (subjects.includes('All Subjects')) {
      return ['All Subjects'];
    }

    return subjects;
  } catch (error) {
    console.error('Get teacher subjects error:', error);
    throw error;
  }
},

};

export default getApi();
