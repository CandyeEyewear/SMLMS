-- =============================================
-- LMS PLATFORM - COMPLETE DATABASE SCHEMA
-- Version: 1.0
-- Total Tables: 48
--
-- This schema consolidates all requirements from:
-- - LMS_PROJECT_GUIDE.md
-- - COURSE_BUILDER_GUIDE.md
-- - PRICING_SYSTEM.md
-- - CONTENT_BLOCKS_REFERENCE.md
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- SECTION 1: SUBSCRIPTION PLANS
-- =============================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('standard', 'professional', 'enterprise')),
  per_user_monthly DECIMAL(10,2) NOT NULL,
  per_user_annually DECIMAL(10,2),
  setup_fee DECIMAL(10,2) DEFAULT 0.00,
  max_users INTEGER,
  max_courses INTEGER,
  max_groups INTEGER,
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 2: COMPANIES
-- =============================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1A4490',
  secondary_color TEXT DEFAULT '#2BB5C5',
  custom_domain TEXT,
  per_user_fee DECIMAL(10,2) DEFAULT 0.00,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annually')),
  subscription_plan_id UUID REFERENCES subscription_plans(id),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 3: USER PROFILES
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'user')),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 4: GROUPS
-- =============================================

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_groups (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, group_id)
);

-- =============================================
-- SECTION 5: SESSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('web', 'mobile_ios', 'mobile_android')),
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 6: INVITE LINKS
-- =============================================

CREATE TABLE IF NOT EXISTS invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  use_count INTEGER DEFAULT 0,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 7: COURSE CATEGORIES
-- =============================================

CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 8: COURSES
-- =============================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES course_categories(id),

  -- Course Intro Fields
  overview TEXT,
  objectives JSONB DEFAULT '[]',
  target_audience JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  estimated_duration_minutes INTEGER DEFAULT 0,

  -- Course Outro Fields
  course_summary TEXT,
  next_steps TEXT,
  resources JSONB DEFAULT '[]',

  -- Settings
  original_prompt TEXT,
  passing_score INTEGER DEFAULT 70,
  award_certificate BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',

  -- Creation tracking
  creation_source TEXT CHECK (creation_source IN ('direct', 'request')) DEFAULT 'direct',
  course_request_id UUID,

  -- Publishing
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Audit
  created_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 9: COURSE VERSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS course_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_snapshot JSONB NOT NULL,
  is_current BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES profiles(id),
  change_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, version_number)
);

-- =============================================
-- SECTION 10: MODULES
-- =============================================

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  introduction TEXT,
  summary TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_duration_minutes INTEGER DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 11: LESSONS
-- =============================================

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_duration_minutes INTEGER DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 12: LESSON BLOCKS (Content Blocks)
-- =============================================

CREATE TABLE IF NOT EXISTS lesson_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'text', 'heading', 'quote', 'divider',
    'bullet_list', 'numbered_list', 'numbered_steps', 'checklist',
    'image', 'video', 'audio', 'file',
    'accordion', 'tabs', 'flashcard', 'hotspot_image',
    'callout', 'table', 'comparison', 'timeline', 'stats', 'code', 'glossary'
  )),
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 13: QUIZZES
-- =============================================

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL UNIQUE REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit_minutes INTEGER,
  shuffle_questions BOOLEAN DEFAULT false,
  show_correct_answers BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 14: QUIZ QUESTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 'multiple_select', 'true_false', 'fill_blank',
    'drag_match', 'drag_order', 'drag_category', 'hotspot', 'slider', 'short_answer'
  )),
  question_text TEXT NOT NULL,
  question_media JSONB,
  answer_config JSONB NOT NULL DEFAULT '{}',
  correct_answer JSONB NOT NULL DEFAULT '{}',
  explanation TEXT,
  feedback_correct TEXT,
  feedback_incorrect TEXT,
  points INTEGER DEFAULT 1,
  partial_credit BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 15: MEDIA
-- =============================================

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES profiles(id),
  source_type TEXT NOT NULL CHECK (source_type IN (
    'ai_generated', 'direct_upload', 'external_url', 'library_copy'
  )),
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('image', 'video', 'document', 'audio')),
  file_size_bytes INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER,
  original_url TEXT,
  is_external BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  ai_model TEXT,
  ai_cost DECIMAL(10,4),
  title TEXT,
  description TEXT,
  alt_text TEXT,
  tags JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_media (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (lesson_id, media_id)
);

-- =============================================
-- SECTION 16: COURSE REQUESTS
-- =============================================

CREATE TABLE IF NOT EXISTS course_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_topic TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  industry TEXT,
  desired_modules INTEGER DEFAULT 4,
  lessons_per_module INTEGER DEFAULT 3,
  tone TEXT CHECK (tone IN ('formal', 'conversational', 'technical')) DEFAULT 'conversational',
  topics_to_cover TEXT,
  topics_to_avoid TEXT,
  company_context TEXT,
  reference_materials JSONB DEFAULT '[]',
  additional_notes TEXT,
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  requested_deadline DATE,
  status TEXT CHECK (status IN (
    'pending', 'in_review', 'approved', 'in_progress', 'completed', 'rejected'
  )) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to courses after course_requests is created
ALTER TABLE courses ADD CONSTRAINT IF NOT EXISTS fk_course_request
  FOREIGN KEY (course_request_id) REFERENCES course_requests(id) ON DELETE SET NULL;

-- =============================================
-- SECTION 17: ENROLLMENTS
-- =============================================

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')) DEFAULT 'active',
  scheduled_start_date TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  schedule_notification_sent_at TIMESTAMPTZ,
  enrollment_notification_sent_at TIMESTAMPTZ,
  setup_fee DECIMAL(10,2) DEFAULT 0.00,
  setup_fee_paid BOOLEAN DEFAULT false,
  assigned_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT enrollment_target CHECK (
    (group_id IS NOT NULL AND user_id IS NULL) OR
    (group_id IS NULL AND user_id IS NOT NULL)
  )
);

-- =============================================
-- SECTION 18: PROGRESS TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_version_id UUID REFERENCES course_versions(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0,
  total_time_spent_seconds INTEGER DEFAULT 0,
  final_score INTEGER,
  passed BOOLEAN,
  due_date TIMESTAMPTZ,
  is_overdue BOOLEAN GENERATED ALWAYS AS (
    due_date IS NOT NULL AND completed_at IS NULL AND due_date < NOW()
  ) STORED,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  time_spent_seconds INTEGER DEFAULT 0,
  video_watch_percentage INTEGER DEFAULT 0,
  first_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score INTEGER,
  passed BOOLEAN,
  answers JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'login', 'course_started', 'course_completed', 'lesson_started',
    'lesson_completed', 'quiz_started', 'quiz_completed', 'quiz_failed',
    'video_watched', 'certificate_earned'
  )),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 19: CERTIFICATES
-- =============================================

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  final_score INTEGER,
  pdf_url TEXT,
  verification_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- SECTION 20: FEEDBACK
-- =============================================

CREATE TABLE IF NOT EXISTS course_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- SECTION 21: REMINDERS
-- =============================================

CREATE TABLE IF NOT EXISTS reminder_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reminder_type TEXT NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  trigger_days_before_deadline INTEGER,
  trigger_days_after_inactivity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN (
    'deadline_approaching', 'overdue', 'course_assigned',
    'inactivity', 'quiz_retry_available', 'custom'
  )),
  title TEXT NOT NULL,
  message TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  delivery_method TEXT CHECK (delivery_method IN ('email', 'push', 'both')) DEFAULT 'both',
  is_sent BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 22: NOTIFICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'course_scheduled', 'course_enrolled', 'deadline_approaching',
    'deadline_overdue', 'quiz_passed', 'quiz_failed', 'course_completed',
    'reminder', 'system'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'course_scheduled', 'course_enrolled', 'deadline_reminder',
    'overdue_notice', 'course_completed', 'quiz_results',
    'welcome', 'password_reset', 'custom'
  )),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 23: PRICING SYSTEM
-- =============================================

-- Course Pricing (Global defaults per course)
CREATE TABLE IF NOT EXISTS course_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  setup_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  reactivation_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  seat_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'JMD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id)
);

-- Company Pricing Overrides
CREATE TABLE IF NOT EXISTS company_pricing_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  setup_fee_override DECIMAL(10,2),
  reactivation_fee_override DECIMAL(10,2),
  seat_fee_override DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, course_id)
);

-- Course Activations (tracks which companies have access)
CREATE TABLE IF NOT EXISTS course_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_renewal BOOLEAN DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending_payment')) DEFAULT 'pending_payment',
  seat_count INTEGER NOT NULL DEFAULT 0,
  setup_fee_paid DECIMAL(10,2) DEFAULT 0.00,
  seat_fee_paid DECIMAL(10,2) DEFAULT 0.00,
  total_paid DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, course_id, activated_at)
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_activation_id UUID REFERENCES course_activations(id) ON DELETE SET NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'JMD',
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  item_type TEXT CHECK (item_type IN ('setup_fee', 'reactivation_fee', 'seat_fee', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expiry Reminders
CREATE TABLE IF NOT EXISTS expiry_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_activation_id UUID NOT NULL REFERENCES course_activations(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('30_day', '7_day', '1_day', 'expired')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_to TEXT NOT NULL,
  UNIQUE(course_activation_id, reminder_type)
);

-- =============================================
-- SECTION 24: PAYMENTS
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_activation_id UUID REFERENCES course_activations(id),
  enrollment_id UUID REFERENCES enrollments(id),
  payment_type TEXT CHECK (payment_type IN ('setup_fee', 'user_subscription', 'course_activation')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JMD',
  ezee_transaction_id TEXT,
  user_count INTEGER,
  billing_period_start DATE,
  billing_period_end DATE,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 25: AUDIT LOG
-- =============================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'user_created', 'user_updated', 'user_deleted', 'user_invited',
    'group_created', 'group_updated', 'group_deleted',
    'course_assigned', 'course_unassigned', 'enrollment_cancelled',
    'settings_changed', 'export_requested', 'login', 'login_failed', 'password_changed'
  )),
  target_type TEXT,
  target_id UUID,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 26: LOCALIZATION
-- =============================================

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Spanish'),
  ('fr', 'French')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS course_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code),
  title TEXT NOT NULL,
  description TEXT,
  is_ai_translated BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, language_code)
);

CREATE TABLE IF NOT EXISTS lesson_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL REFERENCES languages(code),
  title TEXT NOT NULL,
  text_content TEXT,
  is_ai_translated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, language_code)
);

-- =============================================
-- SECTION 27: SCORM SUPPORT
-- =============================================

CREATE TABLE IF NOT EXISTS scorm_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  scorm_version TEXT CHECK (scorm_version IN ('1.2', '2004_3rd', '2004_4th')),
  package_url TEXT NOT NULL,
  manifest_data JSONB,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scorm_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scorm_package_id UUID NOT NULL REFERENCES scorm_packages(id) ON DELETE CASCADE,
  completion_status TEXT,
  success_status TEXT,
  score_raw DECIMAL(10,2),
  score_min DECIMAL(10,2),
  score_max DECIMAL(10,2),
  total_time TEXT,
  suspend_data TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scorm_package_id)
);

-- =============================================
-- INDEXES
-- =============================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Groups
CREATE INDEX IF NOT EXISTS idx_groups_company ON groups(company_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_user ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group ON user_groups(group_id);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions(user_id) WHERE is_active = true;

-- Invite Links
CREATE INDEX IF NOT EXISTS idx_invite_links_company ON invite_links(company_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_code ON invite_links(code);

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- Modules
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_sort ON modules(course_id, sort_order);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sort ON lessons(module_id, sort_order);

-- Lesson Blocks
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_lesson ON lesson_blocks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_order ON lesson_blocks(lesson_id, sort_order);

-- Quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_module ON quizzes(module_id);

-- Quiz Questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_sort ON quiz_questions(quiz_id, sort_order);

-- Course Requests
CREATE INDEX IF NOT EXISTS idx_course_requests_company ON course_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_course_requests_status ON course_requests(status);

-- Enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_company ON enrollments(company_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_group ON enrollments(group_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_scheduled ON enrollments(scheduled_start_date) WHERE status = 'scheduled';

-- User Progress
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);

-- Quiz Attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- Activity Log
CREATE INDEX IF NOT EXISTS idx_activity_log_user_created ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_company_created ON activity_log(company_id, created_at DESC);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_code);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC) WHERE is_read = false;

-- Email Queue
CREATE INDEX IF NOT EXISTS idx_email_queue_pending ON email_queue(scheduled_for) WHERE status = 'pending';

-- Pricing
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_company_pricing_overrides_company_id ON company_pricing_overrides(company_id);
CREATE INDEX IF NOT EXISTS idx_company_pricing_overrides_course_id ON company_pricing_overrides(course_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_company_id ON course_activations(company_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_course_id ON course_activations(course_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_status ON course_activations(status);
CREATE INDEX IF NOT EXISTS idx_course_activations_expires_at ON course_activations(expires_at);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_company ON payments(company_id);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_company_created ON audit_log(company_id, created_at DESC);

-- =============================================
-- VIEWS
-- =============================================

CREATE OR REPLACE VIEW active_companies AS
SELECT * FROM companies WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_profiles AS
SELECT * FROM profiles WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_groups AS
SELECT * FROM groups WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_courses AS
SELECT * FROM courses WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_modules AS
SELECT * FROM modules WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_enrollments AS
SELECT * FROM enrollments WHERE deleted_at IS NULL;

-- =============================================
-- FUNCTIONS
-- =============================================

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Get Effective Price Function
CREATE OR REPLACE FUNCTION get_effective_price(
  p_course_id UUID,
  p_company_id UUID
)
RETURNS TABLE (
  setup_fee DECIMAL(10,2),
  reactivation_fee DECIMAL(10,2),
  seat_fee DECIMAL(10,2),
  currency TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH course_default AS (
    SELECT cp.setup_fee, cp.reactivation_fee, cp.seat_fee, cp.currency
    FROM course_pricing cp
    WHERE cp.course_id = p_course_id
  ),
  company_specific_override AS (
    SELECT cpo.setup_fee_override, cpo.reactivation_fee_override, cpo.seat_fee_override
    FROM company_pricing_overrides cpo
    WHERE cpo.company_id = p_company_id
      AND cpo.course_id = p_course_id
  ),
  company_wide_override AS (
    SELECT cpo.setup_fee_override, cpo.reactivation_fee_override, cpo.seat_fee_override
    FROM company_pricing_overrides cpo
    WHERE cpo.company_id = p_company_id
      AND cpo.course_id IS NULL
  )
  SELECT
    COALESCE(
      company_specific_override.setup_fee_override,
      company_wide_override.setup_fee_override,
      course_default.setup_fee,
      0.00
    ) as setup_fee,
    COALESCE(
      company_specific_override.reactivation_fee_override,
      company_wide_override.reactivation_fee_override,
      course_default.reactivation_fee,
      0.00
    ) as reactivation_fee,
    COALESCE(
      company_specific_override.seat_fee_override,
      company_wide_override.seat_fee_override,
      course_default.seat_fee,
      0.00
    ) as seat_fee,
    COALESCE(course_default.currency, 'JMD') as currency
  FROM course_default
  LEFT JOIN company_specific_override ON true
  LEFT JOIN company_wide_override ON true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Generate Invoice Number Function
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_count INTEGER;
  v_invoice_number TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM NOW());

  SELECT COUNT(*) + 1 INTO v_count
  FROM invoices
  WHERE EXTRACT(YEAR FROM created_at) = v_year;

  v_invoice_number := 'INV-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');

  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Handle New User Signup Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_pricing_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expiry_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorm_tracking ENABLE ROW LEVEL SECURITY;

-- Super Admin Policies (full access)
CREATE POLICY "Super admin full access companies" ON companies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

CREATE POLICY "Super admin full access profiles" ON profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'super_admin'
  )
);

CREATE POLICY "Super admin full access courses" ON courses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

CREATE POLICY "Super admin full access course_categories" ON course_categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- User Policies
CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users see own company" ON companies FOR SELECT USING (
  id IN (
    SELECT company_id FROM profiles
    WHERE profiles.id = auth.uid()
    AND company_id IS NOT NULL
  )
);

CREATE POLICY "Users see own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users see own course progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own course progress" ON user_course_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own course progress" ON user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users see own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own lesson progress" ON user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lesson progress" ON user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Published courses are viewable by authenticated users
CREATE POLICY "Published courses viewable" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Published modules viewable" ON modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE courses.id = modules.course_id AND courses.is_published = true)
);
CREATE POLICY "Published lessons viewable" ON lessons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM modules
    JOIN courses ON courses.id = modules.course_id
    WHERE modules.id = lessons.module_id AND courses.is_published = true
  )
);
CREATE POLICY "Published lesson blocks viewable" ON lesson_blocks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM lessons
    JOIN modules ON modules.id = lessons.module_id
    JOIN courses ON courses.id = modules.course_id
    WHERE lessons.id = lesson_blocks.lesson_id AND courses.is_published = true
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =============================================
-- END OF SCHEMA
-- =============================================
