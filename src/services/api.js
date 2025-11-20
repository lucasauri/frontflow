import axios from 'axios';
import { authService } from './authService';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  async (error) => {
    // Handle 401 with refresh retry
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await authService.refresh();
        if (data?.accessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        // fallthrough to logout
      }
      await authService.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 403:
          console.error('🚫 Forbidden:', data?.message || 'Access denied');
          break;
        case 404:
          console.error('🔍 Not Found:', data?.message || 'Resource not found');
          break;
        case 422:
          console.error('⚠️ Validation Error:', data?.message || 'Invalid data');
          break;
        case 500:
          console.error('💥 Server Error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('❌ API Error:', data?.message || 'An error occurred');
      }
    } else if (error.request) {
      console.error('🌐 Network Error:', 'No response received');
    } else {
      console.error('⚙️ Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed');
  }
};

// Database health check
export const databaseHealthCheck = async () => {
  try {
    const response = await api.get('/health/database');
    return response.data;
  } catch (error) {
    throw new Error('Database health check failed');
  }
};

export default api;
