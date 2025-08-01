export interface Task {
  id: string;
  title: string;
  description: string;
  property: string;
  status: 'pending' | 'in_progress' | 'completed' | 'needs_followup';
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  instructions?: string;
  address: string;
  scheduledTime?: string;
  photos?: Photo[];
  issues?: Issue[];
  aiFeedback?: AIFeedback[];
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'office';
  rooms: number;
  bathrooms: number;
  instructions?: string;
  specialRequirements?: string[];
}

export interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  specialties: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface Photo {
  id: string;
  taskId: string;
  url: string;
  type: 'before' | 'during' | 'after';
  uploadedAt: string;
  isUploaded: boolean;
  localPath?: string;
  tags?: string[];
  notes?: string;
  voiceNotes?: string;
}

export interface Issue {
  id: string;
  taskId: string;
  type: 'stain' | 'crack' | 'weed' | 'damage' | 'maintenance' | 'other';
  description: string;
  photoId?: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  notes?: string;
  voiceNotes?: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface AIFeedback {
  id: string;
  taskId: string;
  photoId?: string;
  issueId?: string;
  feedback: string;
  confidence: number;
  suggestions: string[];
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface PhotoAnalysis {
  id: string;
  taskId: string;
  photoUrl: string;
  analysis: {
    cleanliness: number;
    issues: string[];
    recommendations: string[];
  };
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cleaner' | 'admin' | 'supervisor';
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loginMethod: 'password' | 'otp';
}

export interface OfflineData {
  pendingPhotos: Photo[];
  pendingIssues: Issue[];
  pendingStatusUpdates: { taskId: string; status: string }[];
  lastSync: string;
}

export interface OTPRequest {
  email: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  otp?: string;
} 