
import { UserType } from '@/types';

// Mock users for local testing
export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    type: 'admin' as UserType,
    department: 'Human Resources',
    position: 'HR Manager',
    avatar_url: null
  },
  {
    id: '2',
    name: 'IT Professional',
    email: 'it@example.com',
    password: 'password123',
    type: 'it_professional' as UserType,
    department: 'Information Technology',
    position: 'Software Engineer',
    avatar_url: null
  }
];
