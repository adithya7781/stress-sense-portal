
import { mockUsers } from './mockData';
import { UserType } from '@/types';

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
    // Return mock users without passwords but with proper typing
    return { 
      data: mockUsers.map(({ password, ...user }) => ({
        ...user,
        // Ensure avatar is properly mapped from avatar_url
        avatar: user.avatar_url,
        // Add these properties used in the admin dashboard
        isNew: Math.random() > 0.7, // Random for demo purposes
        hasAccess: user.type === 'admin' ? true : Math.random() > 0.5 // Admins always have access
      }))
    };
  }
};
