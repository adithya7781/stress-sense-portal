
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
