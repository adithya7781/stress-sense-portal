
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

// Mock users for local testing
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    type: 'admin',
    department: 'Human Resources',
    position: 'HR Manager',
    avatar_url: null
  },
  {
    id: '2',
    name: 'IT Professional',
    email: 'it@example.com',
    password: 'password123',
    type: 'it_professional',
    department: 'Information Technology',
    position: 'Software Engineer',
    avatar_url: null
  }
];

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string, userType: string) => {
    // Mock login functionality instead of API call
    try {
      console.log('Login attempt with:', { email, password, userType });
      
      // Find the user in our mock database
      const user = mockUsers.find(u => u.email === email && u.password === password && u.type === userType);
      
      if (!user) {
        // Simulate API error response format
        const error = new Error('Invalid credentials');
        (error as any).response = {
          data: { message: 'Invalid email or password' },
          status: 401
        };
        throw error;
      }
      
      // Create a mock token (in a real app this would be a JWT)
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      // Return in the format expected by the login handler
      return {
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            department: user.department,
            position: user.position,
            avatar: user.avatar_url
          }
        }
      };
    } catch (error) {
      console.error('Mock login error:', error);
      throw error;
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
    // Mock register functionality
    try {
      console.log('Register attempt with:', userData);
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        // Simulate API error response format
        const error = new Error('User already exists');
        (error as any).response = {
          data: { message: 'Email already in use' },
          status: 409
        };
        throw error;
      }
      
      // Create a new mock user
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        type: userData.type,
        department: userData.department || null,
        position: userData.position || null,
        avatar_url: null
      };
      
      // Add to our mock database
      mockUsers.push(newUser);
      
      // Return success response
      return {
        data: {
          message: 'User registered successfully',
          user_id: newUser.id
        }
      };
    } catch (error) {
      console.error('Mock register error:', error);
      throw error;
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
    // Mock implementation
    console.log('Updating access for user', userId, accessSettings);
    return { data: { message: 'Access settings updated successfully' } };
  },
  
  getUsers: async () => {
    // Return mock users without passwords
    return { 
      data: mockUsers.map(({ password, ...user }) => user) 
    };
  }
};

// Stress detection API calls
export const stressApi = {
  detectStress: async (imageData: string | File, source: string, notes?: string) => {
    // Mock stress detection
    console.log('Stress detection called with source:', source);
    
    // Simulate random stress level
    const levels = ['low', 'medium', 'high', 'severe'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const randomScore = Math.floor(Math.random() * 100);
    
    return {
      data: {
        record_id: `mock-record-${Date.now()}`,
        result: {
          stress_level: randomLevel,
          stress_score: randomScore,
          confidence: 0.85
        }
      }
    };
  },
  
  getHistory: async (userId?: string, limit?: number) => {
    // Mock stress history
    console.log('Getting stress history for user:', userId, 'limit:', limit);
    
    const mockHistory = [];
    const count = limit || 5;
    const levels = ['low', 'medium', 'high', 'severe'];
    
    for (let i = 0; i < count; i++) {
      mockHistory.push({
        id: `history-${i}`,
        user_id: userId || '1',
        level: levels[Math.floor(Math.random() * levels.length)],
        score: Math.floor(Math.random() * 100),
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        source: i % 2 === 0 ? 'image' : 'realtime',
        notes: i % 3 === 0 ? 'Some notes about this reading' : null
      });
    }
    
    return { data: mockHistory };
  },
  
  getTrend: async (userId?: string, days: number = 7) => {
    // Mock trend data
    console.log('Getting trend data for user:', userId, 'days:', days);
    
    const mockTrend = [];
    for (let i = 0; i < days; i++) {
      mockTrend.push({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        avg_score: 40 + Math.floor(Math.random() * 40),
        max_score: 60 + Math.floor(Math.random() * 40)
      });
    }
    
    return { data: mockTrend };
  }
};

export default { authApi, userApi, stressApi };
