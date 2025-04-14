
import { UserType } from '@/types';
import { mockUsers } from './mockData';

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
      
      // Create a new mock user with proper typing
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        type: userData.type as UserType,
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
