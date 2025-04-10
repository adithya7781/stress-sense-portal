import axios from 'axios';

// Base API configuration
const API_URL = 'https://3476a56b-ec7f-4eb6-8bef-435af9930e0d.lovableproject.com/api';

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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string, userType: string) => {
    try {
      console.log('Login attempt:', { email, userType });
      const response = await apiClient.post('/login', { email, password, type: userType });
      console.log('Login response:', response);
      
      // For demo purposes, create mock user if backend is not available
      if (response.status === 404 || !response.data) {
        console.log('Backend not available, using mock data');
        // Mock successful response for demo purposes
        return {
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: 'mock-id-' + Date.now(),
              name: email.split('@')[0],
              email: email,
              type: userType,
              department: userType === 'admin' ? 'Human Resources' : 'IT',
              position: userType === 'admin' ? 'HR Manager' : 'IT Professional',
              hasAccess: userType === 'admin' ? true : Math.random() > 0.5,
              isNew: Math.random() > 0.7,
            }
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      
      // For demo purposes, return mock data if backend is not available
      return {
        data: {
          token: 'mock-token-' + Date.now(),
          user: {
            id: 'mock-id-' + Date.now(),
            name: email.split('@')[0],
            email: email,
            type: userType,
            department: userType === 'admin' ? 'Human Resources' : 'IT',
            position: userType === 'admin' ? 'HR Manager' : 'IT Professional',
            hasAccess: userType === 'admin' ? true : Math.random() > 0.5,
            isNew: Math.random() > 0.7,
          }
        }
      };
    }
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    type: string;
    department?: string;
    position?: string;
  }) => {
    try {
      console.log('Register attempt:', userData);
      const response = await apiClient.post('/register', userData);
      console.log('Register response:', response);
      
      // For demo purposes, return mock success if backend is not available
      if (response.status === 404 || !response.data) {
        console.log('Backend not available, using mock data');
        return {
          data: {
            message: 'User created successfully',
            user_id: 'mock-id-' + Date.now(),
          }
        };
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      
      // For demo purposes, return mock data if backend is not available
      return {
        data: {
          message: 'User created successfully',
          user_id: 'mock-id-' + Date.now(),
        }
      };
    }
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
