export type UserRole = 'student' | 'faculty' | 'teacher' | 'verifier' | 'admin' | 'management';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  sources?: Source[];
  timestamp?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface Source {
  text: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface UploadedFile {
  name: string;
  type: string;
  chunks: number;
  uploadTime: string;
}

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

export interface DashboardProps {
  userName: string;
}

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
}

export interface WebSocketMessage {
  type: string;
  data?: unknown;
  message?: string;
}

export interface NotificationData {
  id: string;
  type: 'notification' | 'announcement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}
