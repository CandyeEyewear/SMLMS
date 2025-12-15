// packages/shared/src/constants/index.ts
// LMS Platform - Shared Constants

// =============================================================================
// BRAND COLORS
// =============================================================================

export const COLORS = {
  PRIMARY: '#1A4490',
  ACCENT: '#2BB5C5',
  NEUTRAL: '#C4BEB5',
  WHITE: '#FFFFFF',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
} as const;

// =============================================================================
// USER ROLES
// =============================================================================

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.COMPANY_ADMIN]: 'Company Admin',
  [ROLES.USER]: 'User',
};

// =============================================================================
// SUBSCRIPTION TIERS
// =============================================================================

export const TIERS = {
  STANDARD: 'standard',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

export type Tier = typeof TIERS[keyof typeof TIERS];

export const TIER_LIMITS = {
  [TIERS.STANDARD]: { maxUsers: 50, maxGroups: 10, maxCourses: 5 },
  [TIERS.PROFESSIONAL]: { maxUsers: 500, maxGroups: 50, maxCourses: 25 },
  [TIERS.ENTERPRISE]: { maxUsers: null, maxGroups: null, maxCourses: null },
} as const;

// =============================================================================
// STATUS ENUMS
// =============================================================================

export const ENROLLMENT_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PROGRESS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// =============================================================================
// CONTENT BLOCK TYPES
// =============================================================================

export const BLOCK_TYPES = {
  TEXT: 'text',
  BULLET_LIST: 'bullet_list',
  NUMBERED_STEPS: 'numbered_steps',
  ACCORDION: 'accordion',
  FLASHCARD: 'flashcard',
  CALLOUT: 'callout',
  TABLE: 'table',
  TIMELINE: 'timeline',
  TABS: 'tabs',
  IMAGE: 'image',
  VIDEO: 'video',
  CHECKLIST: 'checklist',
  QUOTE: 'quote',
  GLOSSARY: 'glossary',
  COMPARISON: 'comparison',
  CODE: 'code',
  HOTSPOT_IMAGE: 'hotspot_image',
} as const;

export type BlockType = typeof BLOCK_TYPES[keyof typeof BLOCK_TYPES];

// =============================================================================
// QUIZ QUESTION TYPES
// =============================================================================

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  MULTIPLE_SELECT: 'multiple_select',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  DRAG_MATCH: 'drag_match',
  DRAG_ORDER: 'drag_order',
  DRAG_CATEGORY: 'drag_category',
  HOTSPOT: 'hotspot',
  SLIDER: 'slider',
  SHORT_ANSWER: 'short_answer',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

// =============================================================================
// CALLOUT TYPES
// =============================================================================

export const CALLOUT_TYPES = {
  TIP: 'tip',
  WARNING: 'warning',
  NOTE: 'note',
  DANGER: 'danger',
  INFO: 'info',
} as const;

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export const NOTIFICATION_TYPES = {
  COURSE_SCHEDULED: 'course_scheduled',
  COURSE_ENROLLED: 'course_enrolled',
  DEADLINE_APPROACHING: 'deadline_approaching',
  DEADLINE_OVERDUE: 'deadline_overdue',
  QUIZ_PASSED: 'quiz_passed',
  QUIZ_FAILED: 'quiz_failed',
  COURSE_COMPLETED: 'course_completed',
  REMINDER: 'reminder',
  SYSTEM: 'system',
} as const;

// =============================================================================
// EMAIL TYPES
// =============================================================================

export const EMAIL_TYPES = {
  COURSE_SCHEDULED: 'course_scheduled',
  COURSE_ENROLLED: 'course_enrolled',
  DEADLINE_REMINDER: 'deadline_reminder',
  OVERDUE_NOTICE: 'overdue_notice',
  COURSE_COMPLETED: 'course_completed',
  QUIZ_RESULTS: 'quiz_results',
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  INVITATION: 'invitation',
  CUSTOM: 'custom',
} as const;

// =============================================================================
// MEDIA TYPES
// =============================================================================

export const MEDIA_SOURCE = {
  AI_GENERATED: 'ai_generated',
  DIRECT_UPLOAD: 'direct_upload',
  EXTERNAL_URL: 'external_url',
  LIBRARY_COPY: 'library_copy',
} as const;

export const MEDIA_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
} as const;

// =============================================================================
// COURSE CREATION
// =============================================================================

export const COURSE_TONE = {
  FORMAL: 'formal',
  CONVERSATIONAL: 'conversational',
  TECHNICAL: 'technical',
} as const;

export const COURSE_CREATION_SOURCE = {
  DIRECT: 'direct',
  REQUEST: 'request',
} as const;

// =============================================================================
// ACTIVITY TYPES
// =============================================================================

export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  COURSE_STARTED: 'course_started',
  COURSE_COMPLETED: 'course_completed',
  LESSON_STARTED: 'lesson_started',
  LESSON_COMPLETED: 'lesson_completed',
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_FAILED: 'quiz_failed',
  VIDEO_WATCHED: 'video_watched',
  CERTIFICATE_EARNED: 'certificate_earned',
} as const;

// =============================================================================
// AUDIT ACTIONS
// =============================================================================

export const AUDIT_ACTIONS = {
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_INVITED: 'user_invited',
  GROUP_CREATED: 'group_created',
  GROUP_UPDATED: 'group_updated',
  GROUP_DELETED: 'group_deleted',
  COURSE_CREATED: 'course_created',
  COURSE_UPDATED: 'course_updated',
  COURSE_DELETED: 'course_deleted',
  COURSE_PUBLISHED: 'course_published',
  COURSE_ASSIGNED: 'course_assigned',
  COURSE_UNASSIGNED: 'course_unassigned',
  ENROLLMENT_CANCELLED: 'enrollment_cancelled',
  SETTINGS_CHANGED: 'settings_changed',
  EXPORT_REQUESTED: 'export_requested',
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_CHANGED: 'password_changed',
} as const;

// =============================================================================
// DEFAULTS
// =============================================================================

export const DEFAULTS = {
  PASSING_SCORE: 70,
  MAX_QUIZ_ATTEMPTS: 3,
  MODULES_PER_COURSE: 4,
  LESSONS_PER_MODULE: 3,
  QUESTIONS_PER_QUIZ: 5,
  SESSION_DURATION_SECONDS: 604800, // 7 days
  MIN_PASSWORD_LENGTH: 8,
} as const;

// =============================================================================
// LIMITS
// =============================================================================

export const LIMITS = {
  MAX_FILE_SIZE_BYTES: 104857600, // 100MB
  MAX_IMAGE_SIZE_BYTES: 10485760, // 10MB
  MAX_BULK_UPLOAD_USERS: 500,
  MAX_GROUPS_DISPLAY: 20,
  MAX_RECENT_ACTIVITY: 10,
} as const;
