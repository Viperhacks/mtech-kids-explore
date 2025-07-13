import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/api";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getCompletedResources } from "@/services/apiService";

// Set base URL for API requests
axios.defaults.baseURL = "http://localhost:8080";

interface User {
  id?: string;
  fullName: string;
  username: string;
  role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";
  status?: "PENDING" | "APPROVED";
  gradeLevel?: string;
  assignedLevels?: string[];
  avatar?: string;
  provider?: "google" | "email";
  progress?: {
    [key: string]: {
      completed: number;
      total: number;
      watched: number;
    };
  };
  parentOf?: { id: string; name: string }[];
  // Additional properties used in the app
  name: string;
  grade?: string;
  school?: string;
  earnedBadges?: string[];
  completedLessons?: string[];
  completedVideos?: { [subjectId: string]: string[] }; // <-- Add this line
  email?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    name: string,
    username: string,
    password: string,
    role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN",
    grade?: string
  ) => Promise<any>;
  logout: () => void;
  confirmOtp: (email: string, otp: string) => Promise<any>;
  requestOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
  googleLogin: (
    credential: string,
    name: string,
    email: string,
    picture: string
  ) => Promise<void>;
  updateUserProfile: (userData: any) => Promise<void>;
  trackActivity: (activity: any) => void;
  updateUserProgress: (
    subjectId: string,
    completed: number,
    total: number
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Ensure user has required fields for UI components
          setUser({
            ...parsedUser,
            name: parsedUser.fullName || parsedUser.name || "",
            grade: parsedUser.gradeLevel || parsedUser.grade || "",
            assignedLevels: parsedUser.assignedLevels || [],
            // Default empty values for optional fields
            earnedBadges: parsedUser.earnedBadges || [],
            completedLessons: parsedUser.completedLessons || [],
            school: parsedUser.school || "",
          });
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      console.log("hey", response);

      if (response.data.success) {
        const {
          token,
          refreshToken,
          role,
          status,
          fullName,
          gradeLevel,
          assignedLevels,
          createdAt,
          id,
          earnedBadges,
        } = response.data.data;

        localStorage.setItem("auth_token", token);
        localStorage.setItem("refresh_token", refreshToken);

       let completedLessons: any[] = [];

try {
  const completedRes = await getCompletedResources();
  console.log(completedRes, "completed");

  if (completedRes) {
    const allCompleted = completedRes;

    completedLessons = Object.values(allCompleted)
      .flatMap((subjectGroup: any) =>
        Object.values(subjectGroup).flatMap((resources: any[]) => resources)
      );

    console.log("🔥 Full Completed Lessons:", completedLessons);
  }
} catch (fetchError) {
  console.warn("Failed to fetch completed lessons after login", fetchError);
}


        const userData: User = {
          fullName,
          name: fullName,
          username,
          grade: gradeLevel,
          gradeLevel,
          assignedLevels,
          createdAt: createdAt,
          id: id,
          role,
          status,
          earnedBadges: earnedBadges || [],
         completedLessons: completedLessons || [],
          progress: {},
        };

        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));

        toast({
          title: "Login Successful",
          description: response.data.message || "You're in!"
        });

        // Handle route restoration after successful login
        const returnTo = location.state?.returnTo;
        if (returnTo && returnTo !== "/") {
          navigate(returnTo, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    username: string,
    password: string,
    role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN",
    grade?: string
  ) => {
    try {
      setIsLoading(true);
      const requestData = {
        fullName: name,
        username: username,
        password,
        confirmPassword: password,
        gradeLevel: grade,
      };

      const response = await axios.post(
        `/api/auth/register?role=${role}`,
        requestData
      );
      // console.log("registration response",response);

      if (response.data.success) {
        toast({
          title: "Registration Successful",
          description: "You can now log in with your credentials",
        });
        return response.data;
      }
      //console.log("trying to register ",response.data)
      return response.data;
    } catch (error: any) {
      console.error("Registration failed", error.response.data);
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.message || "Could not create your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/auth/confirm-otp?email=${email}&otp=${otp}`
      );

      if (response.data.success) {
        toast({
          title: "OTP Confirmed",
          description: response.data.message,
        });
        return response.data;
      }

      return response.data;
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid or expired OTP",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/auth/request-otp?email=${email}`);
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.response?.data?.message || "Could not send OTP",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (
    credential: string,
    name: string,
    email: string,
    picture: string
  ) => {
    try {
      setIsLoading(true);
      const userData: User = {
        fullName: name,
        name: name,
        username: email, // Use email as username for Google login
        email,
        role: "STUDENT",
        avatar: picture,
        provider: "google",
        // Default empty values
        earnedBadges: [],
        completedLessons: [],
        progress: {},
      };
      setUser(userData);
      localStorage.setItem("user_data", JSON.stringify(userData));
      toast({
        title: "Google Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/auth/forgot-password?email=${email}`
      );
      toast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description:
          error.response?.data?.message || "Could not process your request",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/auth/reset-password?token=${token}&newPassword=${password}`
      );
      toast({
        title: "Password Reset",
        description: "Your password has been updated",
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description:
          error.response?.data?.message || "Could not reset your password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(
        `/api/auth/refresh-token?refreshToken=${refreshToken}`
      );

      if (response.data.success) {
        const { token, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("refresh_token", newRefreshToken);
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
    }
  };

  const updateUserProfile = async (userData: any) => {
    // Mock implementation - would be connected to a real API
    try {
      setIsLoading(true);

      // Update the user state with new data
      if (user) {
        const updatedUser = {
          ...user,
          ...userData,
          name: userData.name || user.name,
          fullName: userData.name || user.fullName,
          grade: userData.grade || user.grade,
          gradeLevel: userData.grade || user.gradeLevel,
          school: userData.school || user.school,
        };

        setUser(updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: "Could not update your profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const trackActivity = (activity: any) => {
    // Mock implementation - would be connected to a real API
    console.log("Activity tracked:", activity);
  };

  const updateUserProgress = (
    subjectId: string,
    completed?: number,
    total?: number,
    videoId?: string
  ) => {
    if (user) {
      const updatedUser = { ...user };

      if (!updatedUser.progress) {
        updatedUser.progress = {};
      }

      if (!updatedUser.progress[subjectId]) {
        updatedUser.progress[subjectId] = {
          completed: 0,
          total: total || 0,
          watched: 0,
        };
      }

      // If marking a specific video as completed
      if (videoId) {
        if (!updatedUser.completedVideos) {
          updatedUser.completedVideos = {};
        }

        if (!updatedUser.completedVideos[subjectId]) {
          updatedUser.completedVideos[subjectId] = [];
        }

        // Only add if not already completed
        if (!updatedUser.completedVideos[subjectId].includes(videoId)) {
          updatedUser.completedVideos[subjectId].push(videoId);
          updatedUser.progress[subjectId].completed =
            updatedUser.completedVideos[subjectId].length;
        }
      }
      // For direct progress updates
      else if (completed !== undefined && total !== undefined) {
        updatedUser.progress[subjectId] = { completed, total, watched: 0 };
      }

      // Ensure total is up to date
      if (total !== undefined) {
        updatedUser.progress[subjectId].total = total;
      }

      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    toast({
      title: "Logged Out",
      description: "Successfully logged out",
    });
    navigate("/", { replace: true });
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
    refreshTokens,
    googleLogin,
    updateUserProfile,
    trackActivity,
    updateUserProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
