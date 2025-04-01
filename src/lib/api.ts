
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
      // You could redirect to login or dispatch an action
    }
    return Promise.reject(error);
  }
);

export default api;
