// Application constants
export const APP_NAME = 'SM LMS Platform';
export const APP_DESCRIPTION = 'A modern learning management system';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  USER: 'user',
} as const;

// Course status
export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SUPER_ADMIN: '/super-admin',
  COMPANY_ADMIN: '/company-admin',
  LEARNER: '/learner',
  COURSES: '/courses',
  COURSE_DETAILS: (id: string) => `/courses/${id}`,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    CALLBACK: '/api/auth/callback',
  },
  COURSES: '/api/courses',
  ENROLLMENTS: '/api/enrollments',
  PROGRESS: '/api/progress',
  USERS: '/api/users',
} as const;
