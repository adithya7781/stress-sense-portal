
import axios from 'axios';

// Base API configuration
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stressSenseToken') || sessionStorage.getItem('stressSenseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string, userType: string) => {
    return await apiClient.post('/login', { email, password, type: userType });
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    type: string;
    department?: string;
    position?: string;
  }) => {
    return await apiClient.post('/register', userData);
  }
};

// User API calls
export const userApi = {
  updateAccess: async (userId: string, accessSettings: {
    camera_access?: boolean;
    image_upload_access?: boolean;
    video_upload_access?: boolean;
    realtime_monitoring?: boolean;
  }) => {
    return await apiClient.post('/access/update', { 
      user_id: userId,
      ...accessSettings
    });
  },
  
  getUsers: async () => {
    return await apiClient.get('/users');
  }
};

// Stress detection API calls
export const stressApi = {
  detectStress: async (imageData: string | File, source: string, notes?: string) => {
    const formData = new FormData();
    formData.append('source', source);
    
    if (typeof imageData === 'string') {
      formData.append('image_data', imageData);
    } else {
      formData.append('file', imageData);
    }
    
    if (notes) {
      formData.append('notes', notes);
    }
    
    return await apiClient.post('/stress/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getHistory: async (userId?: string, limit?: number) => {
    let url = '/stress/history';
    const params = new URLSearchParams();
    
    if (userId) {
      params.append('user_id', userId);
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await apiClient.get(url);
  },
  
  getTrend: async (userId?: string, days: number = 7) => {
    let url = '/stress/trend';
    const params = new URLSearchParams();
    
    if (userId) {
      params.append('user_id', userId);
    }
    
    params.append('days', days.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await apiClient.get(url);
  }
};

export default { authApi, userApi, stressApi };
