/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import { AuthManager, isTokenExpired } from './auth';
import { 
  LoginCredentials, 
  LoginResponse, 
  MetricsResponse, 
  UploadResponse,
  ApiError 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = AuthManager.getToken();
  
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AuthManager.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export class ApiClient {
  // Authentication endpoints
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post('/api/auth/login/', credentials);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed, but continuing with local logout');
    } finally {
      AuthManager.logout();
    }
  }

  // Sales endpoints
  static async uploadCSV(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response: AxiosResponse<UploadResponse> = await api.post('/api/sales/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Metrics endpoints
  static async getMetrics(dateFrom?: string, dateTo?: string): Promise<MetricsResponse> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      const queryString = params.toString();
      const url = `/api/metrics/summary/${queryString ? `?${queryString}` : ''}`;
      
      const response: AxiosResponse<MetricsResponse> = await api.get(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private static handleError(error: any): ApiError {
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

export default api;