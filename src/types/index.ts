
export type UserType = 'it_professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  department?: string;
  position?: string;
  avatar?: string;
  isNew?: boolean; // Flag to identify new users
  hasAccess?: boolean; // Flag to determine if user has been granted access
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

// Add progress indicator colors for stress levels
export const stressLevelProgressMap = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500',
  severe: 'bg-red-700'
};

// Add readable text labels for stress levels
export const stressLevelTextMap = {
  low: 'Normal',
  medium: 'Moderate',
  high: 'High',
  severe: 'Severe'
};

// Add descriptive messages for each stress level
export const stressLevelMessageMap = {
  low: 'Your stress levels are normal. Keep up the good work!',
  medium: 'Your stress levels are moderate. Consider taking short breaks.',
  high: 'Your stress levels are high. We recommend taking time to relax and practice stress management techniques.',
  severe: 'Your stress levels are severe. Please consider talking to a professional and take immediate steps to reduce stress.'
};
