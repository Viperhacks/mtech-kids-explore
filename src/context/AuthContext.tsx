import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../lib/TokenStorage";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  refreshAccessToken as apiRefreshAccessToken,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
  verifyOTP as apiVerifyOTP,
  API_BASE_URL,
  getUserProfile as apiGetUserProfile,
} from "../services/apiService";

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (resetData: any) => Promise<void>;
  verifyOTP: (otpData: any) => Promise<void>;
  getUserProfile: () => Promise<void>;
  updateUserProgress: (progressData: any) => void;
  trackActivity: (activityData: any) => void;
  updateUserProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAuthToken] = useState<string | null>(
    getAccessToken() || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = getAccessToken();
    if (storedAccessToken) {
      setAuthToken(storedAccessToken);
      try {
        const decodedToken: any = jwtDecode(storedAccessToken);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await apiLogin(credentials);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setAuthToken(data.access_token);
      const decodedToken: any = jwtDecode(data.access_token);
      setUser(decodedToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await apiRegister(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout().finally(() => {
      clearTokens();
      setAuthToken(null);
      setUser(null);
      navigate("/login");
    });
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        navigate("/login");
        return;
      }
      const data = await apiRefreshAccessToken({ refresh_token: refreshToken });
      setAccessToken(data.access_token);
      setAuthToken(data.access_token);
      const decodedToken: any = jwtDecode(data.access_token);
      setUser(decodedToken);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await apiForgotPassword(email);
      navigate("/otp-verification");
    } catch (error) {
      console.error("Forgot password request failed:", error);
      throw error;
    }
  };

  const resetPassword = async (resetData: any) => {
    try {
      await apiResetPassword(resetData);
      navigate("/login");
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  const verifyOTP = async (otpData: any) => {
    try {
      await apiVerifyOTP(otpData);
      navigate("/reset-password");
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  };

  const getUserProfile = async () => {
    try {
      const profile = await apiGetUserProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const getToken = () => {
    return getAccessToken();
  };

  const updateUserProgress = (progressData: any) => {
    console.log('Updating user progress:', progressData);
    // Implementation for updating user progress
  };

  const trackActivity = (activityData: any) => {
    console.log('Tracking activity:', activityData);
    // Implementation for tracking user activity
  };

  const updateUserProfile = async (profileData: any) => {
    console.log('Updating user profile:', profileData);
    try {
      // Implementation for updating user profile
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileData)
      });
      return response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    login,
    register,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    verifyOTP,
    getUserProfile,
    updateUserProgress,
    trackActivity,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
