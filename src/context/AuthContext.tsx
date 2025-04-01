
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher' | 'parent') => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  confirmOtp: (email: string, otp: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  updateUserProgress: (subjectId: string, lessonId: string) => void;
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
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // Mock response for demo
      const mockUser: User = {
        id: '123',
        name: 'Demo User',
        email: email,
        role: 'student',
        completedLessons: [],
        earnedBadges: ['welcome'],
        progress: {
          'math': { watched: 2, completed: 1, total: 10 },
          'english': { watched: 1, completed: 0, total: 8 },
        }
      };
      
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: 'student' | 'teacher' | 'parent') => {
    try {
      setIsLoading(true);
      // This would be an actual API call in a real app
      // const response = await axios.post('/api/auth/signup', { name, email, password, role });
      
      // Mock response for demo
      const mockUser: User = {
        id: '123',
        name: name,
        email: email,
        role: role === 'parent' ? 'student' : role,
        completedLessons: [],
        earnedBadges: ['welcome'],
        progress: {},
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
    updateUserProgress
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
