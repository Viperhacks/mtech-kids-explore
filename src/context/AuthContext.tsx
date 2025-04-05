import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  grade?: string;
  completedLessons?: string[];
  earnedBadges?: string[];
  progress?: {
    [subjectId: string]: {
      watched: number;
      completed: number;
      total: number;
    };
  };
  parentOf?: string[]; // IDs of student accounts a parent has access to
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher' | 'parent', grade?: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  confirmOtp: (email: string, otp: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  updateUserProgress: (subjectId: string, lessonId: string) => void;
  uploadResource: (resource: any) => Promise<void>;
  trackActivity: (activity: any) => Promise<void>;
  connectParentToStudent: (studentEmail: string) => Promise<void>;
  getStudentData: (studentId: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // For demo purposes, we'll use localStorage to simulate authentication
  // In a real app, this would verify a token with the backend
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('mtech_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem('mtech_user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // In a real app, these functions would call a backend API
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // This would be an actual API call in a real app
      // const response = await api.post('/auth/login', { email, password });
      
      // Mock response for demo purposes
      // Check for demo credentials to provide role-specific mock users
      let mockUser: User;
      
      if (email === 'admin@example.com') {
        mockUser = {
          id: '123',
          name: 'Admin User',
          email: email,
          role: 'admin',
          completedLessons: [],
          earnedBadges: ['welcome'],
          progress: {}
        };
      } else if (email === 'teacher@example.com') {
        mockUser = {
          id: '456',
          name: 'Teacher User',
          email: email,
          role: 'teacher',
          completedLessons: [],
          earnedBadges: ['welcome'],
          progress: {}
        };
      } else if (email === 'parent@example.com') {
        mockUser = {
          id: '567',
          name: 'Parent User',
          email: email,
          role: 'student', // Parents use the student role for permissions
          parentOf: ['789'], // Reference to student accounts
          completedLessons: [],
          earnedBadges: [],
          progress: {}
        };
      } else {
        // Default to student
        mockUser = {
          id: '789',
          name: 'Student User',
          email: email,
          role: 'student',
          grade: '3', // Default grade level
          completedLessons: [],
          earnedBadges: ['welcome'],
          progress: {
            'math': { watched: 2, completed: 1, total: 10 },
            'english': { watched: 1, completed: 0, total: 8 },
          }
        };
      }
      
      setUser(mockUser);
      localStorage.setItem('mtech_user', JSON.stringify(mockUser));
      toast({
        title: "Login Successful",
        description: "Welcome back to MTECH Kids Explore!"
      });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      throw error; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: 'student' | 'teacher' | 'parent', grade?: string) => {
    try {
      setIsLoading(true);
      
      // This would be an actual API call in a real app
      // const response = await api.post('/auth/signup', { name, email, password, role, grade });
      
      // Mock response for demo
      const mockUser: User = {
        id: '123',
        name: name,
        email: email,
        role: role === 'parent' ? 'student' : role,
        grade: role === 'student' ? grade : undefined,
        completedLessons: [],
        earnedBadges: ['welcome'],
        progress: {},
        parentOf: role === 'parent' ? [] : undefined
      };
      
      setUser(mockUser);
      localStorage.setItem('mtech_user', JSON.stringify(mockUser));
      toast({
        title: "Registration Successful",
        description: "Welcome to MTECH Kids Explore!"
      });
    } catch (error) {
      console.error('Registration failed', error);
      toast({
        title: "Registration Failed",
        description: "Could not create your account",
        variant: "destructive"
      });
      throw error; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mtech_user');
    toast({
      title: "Logged Out",
      description: "Successfully logged out"
    });
  };
  
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // await axios.post('/api/auth/forgotpassword', { email });
      
      toast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions"
      });
    } catch (error) {
      console.error('Forgot password failed', error);
      toast({
        title: "Request Failed",
        description: "Could not process your request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // await axios.post('/api/auth/resetpassword', { token, password });
      
      toast({
        title: "Password Reset",
        description: "Your password has been updated"
      });
    } catch (error) {
      console.error('Reset password failed', error);
      toast({
        title: "Reset Failed",
        description: "Could not reset your password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // await axios.post('/api/auth/confirmotp', { email, otp });
      
      toast({
        title: "OTP Confirmed",
        description: "Your account has been verified"
      });
    } catch (error) {
      console.error('OTP confirmation failed', error);
      toast({
        title: "Verification Failed",
        description: "Invalid or expired OTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would redirect to Google OAuth
      // For demo purposes, we'll simulate a successful login
      
      const mockUser: User = {
        id: '789',
        name: 'Google User',
        email: 'google@example.com',
        role: 'student',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s120',
        completedLessons: [],
        earnedBadges: ['welcome'],
        progress: {},
      };
      
      setUser(mockUser);
      localStorage.setItem('mtech_user', JSON.stringify(mockUser));
      toast({
        title: "Google Login Successful",
        description: "Welcome to MTECH Kids Explore!"
      });
    } catch (error) {
      console.error('Google login failed', error);
      toast({
        title: "Login Failed",
        description: "Could not sign in with Google",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadResource = async (resource: any) => {
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // await api.post('/resources/upload', resource);
      
      toast({
        title: "Resource Uploaded",
        description: "Your material has been successfully uploaded"
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Resource upload failed', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload your resource",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const trackActivity = async (activity: any) => {
    try {
      // This would be an actual API call in a real app
      // await api.post('/tracking/activity', activity);
      
      // For demo, just log the activity
      console.log('Activity tracked:', activity);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Activity tracking failed', error);
      // Silently fail - don't disrupt user experience for tracking failures
    }
  };
  
  const connectParentToStudent = async (studentEmail: string) => {
    if (!user || user.role !== 'student' || !user.parentOf) {
      toast({
        title: "Connection Failed",
        description: "Only parent accounts can connect to students",
        variant: "destructive"
      });
      return Promise.reject(new Error("Not authorized"));
    }
    
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // const response = await api.post('/parents/connect', { parentId: user.id, studentEmail });
      
      // Mock for demo
      const updatedUser = { ...user };
      // Pretend we got a student ID from the API
      const mockStudentId = `student-${Date.now()}`;
      updatedUser.parentOf = [...updatedUser.parentOf, mockStudentId];
      
      setUser(updatedUser);
      localStorage.setItem('mtech_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Connection Successful",
        description: "You now have access to the student's account"
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Parent-student connection failed', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the student account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStudentData = async (studentId: string) => {
    if (!user || !user.parentOf || !user.parentOf.includes(studentId)) {
      toast({
        title: "Access Denied",
        description: "You don't have access to this student's data",
        variant: "destructive"
      });
      return Promise.resolve(null);
    }
    
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // const response = await api.get(`/students/${studentId}`);
      
      // Mock for demo
      const mockStudentData: User = {
        id: studentId,
        name: "Student Name",
        email: "student@example.com",
        role: "student",
        grade: "3",
        completedLessons: ['lesson1', 'lesson2'],
        earnedBadges: ['welcome', 'eager_learner'],
        progress: {
          'math': { watched: 5, completed: 3, total: 10 },
          'english': { watched: 2, completed: 1, total: 8 },
        }
      };
      
      return Promise.resolve(mockStudentData);
    } catch (error) {
      console.error('Get student data failed', error);
      toast({
        title: "Data Retrieval Failed",
        description: "Could not get the student's data",
        variant: "destructive"
      });
      return Promise.resolve(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProgress = (subjectId: string, lessonId: string) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    
    // Update completed lessons
    const completedLessons = updatedUser.completedLessons || [];
    if (!completedLessons.includes(lessonId)) {
      updatedUser.completedLessons = [...completedLessons, lessonId];
    }
    
    // Update progress for subject
    const progress = updatedUser.progress || {};
    const subjectProgress = progress[subjectId] || { watched: 0, completed: 0, total: 10 };
    
    progress[subjectId] = {
      ...subjectProgress,
      watched: subjectProgress.watched + 1,
      completed: subjectProgress.watched + 1 >= subjectProgress.total 
        ? subjectProgress.total 
        : subjectProgress.completed
    };
    
    updatedUser.progress = progress;
    
    // Check if earned new badge
    const earnedBadges = updatedUser.earnedBadges || [];
    const totalCompleted = Object.values(progress).reduce((sum, curr) => sum + curr.completed, 0);
    
    if (totalCompleted >= 5 && !earnedBadges.includes('eager_learner')) {
      updatedUser.earnedBadges = [...earnedBadges, 'eager_learner'];
      toast({
        title: "Achievement Unlocked!",
        description: "You earned the 'Eager Learner' badge!"
      });
    }
    
    setUser(updatedUser);
    localStorage.setItem('mtech_user', JSON.stringify(updatedUser));
    
    // Track this activity
    trackActivity({
      userId: user.id,
      type: 'lesson_completion',
      subjectId,
      lessonId,
      timestamp: new Date().toISOString()
    });
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    confirmOtp,
    googleLogin,
    updateUserProgress,
    uploadResource,
    trackActivity,
    connectParentToStudent,
    getStudentData
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
