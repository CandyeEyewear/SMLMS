// User types
export type UserRole = 'super_admin' | 'company_admin' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  job_title: string | null;
  bio: string | null;
  phone: string | null;
  timezone: string;
  language: string;
  preferences: Record<string, unknown>;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// Company types
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Course types
export interface Course {
  id: string;
  company_id: string | null;
  category_id: string | null;
  instructor_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration_minutes: number;
  price: number;
  currency: string;
  is_free: boolean;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Enrollment types
export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_by: string | null;
  enrollment_type: 'self' | 'admin' | 'group' | 'subscription';
  status: 'active' | 'completed' | 'expired' | 'cancelled' | 'suspended';
  progress_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
