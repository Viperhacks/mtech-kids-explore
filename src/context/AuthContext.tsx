
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/api';

interface User {
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT';
  status?: 'PENDING' | 'APPROVED';
  gradeLevel?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'STUDENT' | 'TEACHER' | 'PARENT', grade?: string) => Promise<void>;
  logout: () => void;
  confirmOtp: (email: string, otp: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
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

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        const { token, refreshToken, role, status } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        const userData: User = {
          fullName: email.split('@')[0], // This should come from the API
          email,
          role,
          status
        };
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        toast({
          title: "Login Successful",
          description: response.message
        });
      }
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'STUDENT' | 'TEACHER' | 'PARENT', grade?: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(name, email, password, password, role, grade);
      
      if (response.success) {
        const { token } = response.data;
        localStorage.setItem('auth_token', token);
        
        toast({
          title: "Registration Successful",
          description: response.message
        });
      }
    } catch (error: any) {
      console.error('Registration failed', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create your account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response = await authService.confirmOtp(email, otp);
      
      if (response.success) {
        toast({
          title: "OTP Confirmed",
          description: response.message
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authService.requestOtp(email);
      toast({
        title: "OTP Sent",
        description: response || "Check your email for the verification code"
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Could not send OTP",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(email);
      toast({
        title: "Email Sent",
        description: response || "Check your inbox for password reset instructions"
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Could not process your request",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token, password);
      toast({
        title: "Password Reset",
        description: response || "Your password has been updated"
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Could not reset your password",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await authService.refreshToken(refreshToken);
      if (response.success) {
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', newRefreshToken);
      }
    } catch (error) {
      console.error('Token refresh failed', error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    toast({
      title: "Logged Out",
      description: "Successfully logged out"
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    confirmOtp,
    requestOtp,
    forgotPassword,
    resetPassword,
    refreshTokens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
