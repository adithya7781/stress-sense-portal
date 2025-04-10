
export type UserType = 'it_professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  department?: string;
  position?: string;
  avatar?: string;
}

export type StressLevel = 'low' | 'medium' | 'high' | 'severe';

export interface StressRecord {
  id: string;
  userId: string;
  level: StressLevel;
  score: number;
  timestamp: Date;
  source: 'image' | 'video' | 'realtime';
  notes?: string;
  reviewed: boolean;
}

export interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  darkMode: boolean;
}

// Add CSS class mappings for stress levels
export const stressLevelColorMap = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
  severe: 'text-red-700'
};

export const stressLevelBgMap = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
  severe: 'bg-red-700'
};

export const stressLevelBgLightMap = {
  low: 'bg-green-100',
  medium: 'bg-yellow-100',
  high: 'bg-red-100',
  severe: 'bg-red-200'
};
