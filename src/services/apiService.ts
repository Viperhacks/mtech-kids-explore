import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    toast.error(
      error.response?.data?.message || "An unexpected error occurred."
    );
    return Promise.reject(error);
  }
);

export const uploadResource = async (
  file: File,
  type: string,
  grade: string,
  subject: string,
  title: string,
  description: string,
  teacher: string,
  hasQuiz: boolean,
  standaAlone: boolean
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("grade", grade);
  formData.append("subject", subject);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("teacher", teacher);
  formData.append("hasQuiz", String(hasQuiz));
  formData.append("standaAlone", String(standaAlone));

  try {
    const response = await api.post("/resource/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};

export const updateResource = async (
  id: string,
  type: string,
  grade: string,
  subject: string,
  title: string,
  description: string,
  teacher: string,
  hasQuiz: boolean,
  standaAlone: boolean
) => {
  try {
    const response = await api.put(`/resource/${id}`, {
      type,
      grade,
      subject,
      title,
      description,
      teacher,
      hasQuiz,
      standaAlone,
    });
    return response.data;
  } catch (error) {
    console.error("Update failed", error);
    throw error;
  }
};

export const getResources = async (grade: string, subject: string) => {
  try {
    const response = await api.get(`/resource/${grade}/${subject}`);
    return response.data;
  } catch (error) {
    console.error("Fetch failed", error);
    throw error;
  }
};
export const getResourcesForAnyOne = async (grade: string, subject: string) => {
  try {
    const response = await api.get(`/resource/anyone/${grade}/${subject}`);
    return response.data;
  } catch (error) {
    console.error("Fetch failed", error);
    throw error;
  }
};

export const deleteResource = async (id: string) => {
  try {
    await api.delete(`/resource/${id}`);
  } catch (error) {
    console.error("Delete failed", error);
    throw error;
  }
};

export const createQuiz = async (
  title: string,
  description: string,
  grade: string,
  subject: string,
  teacherName: string,
  questions: any[],
  resourceId: string | null,
  standaAlone: boolean
) => {
  try {
    const response = await api.post("/quiz/create", {
      title,
      description,
      grade,
      subject,
      teacherName,
      questions,
      resourceId,
      standaAlone,
    });
    return response.data;
  } catch (error) {
    console.error("Quiz creation failed", error);
    throw error;
  }
};

export const updateQuiz = async (
  quizId: string,
  title: string,
  description: string,
  grade: string,
  subject: string,
  teacherName: string,
  questions: any[],
  resourceId: string | null,
  standaAlone: boolean
) => {
  try {
    const response = await api.put(`/quiz/${quizId}`, {
      title,
      description,
      grade,
      subject,
      teacherName,
      questions,
      resourceId,
      standaAlone,
    });
    return response.data;
  } catch (error) {
    console.error("Quiz update failed", error);
    throw error;
  }
};

export const getAllQuizzes = async () => {
  try {
    const response = await api.get('/quiz/all');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error);
    throw error;
  }
};

export const getQuizQuestions = async (quizId: string) => {
  try {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quiz questions", error);
    throw error;
  }
};

export const deleteQuiz = async (quizId: string) => {
  try {

    const response = await adminService.getAllUsers(page, limit, filters);
    return response; 

  } catch (error) {
    console.error("Failed to delete quiz", error);
    throw error;
  }
};

export const submitQuizAttempt = async (
  quizId: string,
  correctAnswers: number,
  totalQuestions: number
) => {
  try {
    const response = await adminService.getStudentsCreatedByTeacher(teacherId, page, limit);
    return response; 
  } catch (error) {
    console.error('Get students created by teacher error:', error);
    throw error;
  }
};


// userService.ts (shared by admin and teacher)
export const updateUserDetails = async (userId: string, updatedData: any) => {
  try {
    const response = await api.put(`/users/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Update user details error:', error);
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

export const getTeacherSubjects = async () => {
  try {
    const response = await teacherService.getTeacherSubjects();
    return response;
  } catch (error) {
    console.error('Get teacher subjects error:', error);
    throw error;
  }
};

export const getResourceStats = async () => {
  try {
    const response = await adminService.getResourceStats();
    return response.data;
  } catch (error) {
    console.error("Failed to submit quiz attempt", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("User update failed", error);
    throw error;
  }
};

export const getCompletedResources = async () => {
  try {
    const response = await api.get(`/completions`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch completed resources", error);
    throw error;
  }
};

export const markResourceCompleted = async (
  resourceId: number,
  resourceType: string
) => {
  try {
    const response = await api.post(`/completions/markComplete`, {
      resourceId,
      resourceType,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to mark resource as complete", error);
    throw error;
  }
};
