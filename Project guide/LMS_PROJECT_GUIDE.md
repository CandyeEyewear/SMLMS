# LMS Platform - Complete Project Guide

## Document Purpose
This comprehensive guide provides all specifications needed to build an AI-powered Learning Management System (LMS) for corporate training. It serves as the single source of truth for development, designed to guide AI assistants (Claude, Cursor) through building the application in proper sequence.

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Technical Stack](#2-technical-stack)
3. [Database Schema](#3-database-schema)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Feature Specifications](#5-feature-specifications)
6. [Design System](#6-design-system)
7. [Project Structure](#7-project-structure)
8. [Implementation Phases](#8-implementation-phases)
9. [API Architecture](#9-api-architecture)
10. [AI Integration](#10-ai-integration)
11. [Authentication Flow](#11-authentication-flow)
12. [Acceptance Criteria](#12-acceptance-criteria)

---

## 1. Executive Summary

### Project Overview
Build a multi-tenant, AI-powered corporate training LMS that enables:
- **Super Admins** to create courses using AI or manually
- **Company Admins** to manage their teams and assign courses
- **Learners** to complete courses and earn certificates

### Platform Owner
- **Company**: Sales Master Consultants
- **Website**: www.salesmasterjm.com
- **Market**: Caribbean region initially, scalable globally

### Key Differentiators
- AI-powered course generation (GPT-4o, DALL-E 3, Sora)
- Multi-tenant white-label architecture
- Caribbean payment support (eZeePayments)
- Offline mobile learning capability
- 17 content block types for varied learning
- 10 quiz question types for comprehensive assessment

### Subscription Tiers
| Tier | Users | Features |
|------|-------|----------|
| Standard | Up to 50 | Basic reporting, manual reminders |
| Professional | Up to 500 | Advanced analytics, automated reminders, multi-language |
| Enterprise | Unlimited | Full features, SCORM, SSO, API access, custom domain |

---

## 2. Technical Stack

### Core Technologies
| Layer | Technology | Version |
|-------|------------|---------|
| Web Frontend | Next.js | 15 |
| Mobile | Expo (React Native) | SDK 54 |
| Backend | Supabase | Latest |
| Database | PostgreSQL | Via Supabase |
| Authentication | Supabase Auth | Latest |
| File Storage | Supabase Storage | Latest |
| AI - Text | OpenAI GPT-4o | Latest |
| AI - Images | DALL-E 3 | Latest |
| AI - Video | Sora | When available |
| Payments | eZeePayments | Latest |
| Styling | Tailwind CSS | 3.4+ |
| State Management | Zustand | 4.5+ |
| Forms | React Hook Form + Zod | Latest |
| Data Fetching | TanStack Query | 5.x |

### Repository Structure
```
GitHub Repository (Private)
├── Monorepo using Turborepo
├── apps/
│   ├── web/         # Next.js 15
│   └── mobile/      # Expo SDK 54
├── packages/
│   ├── shared/      # Types, constants, utilities
│   └── database/    # Schema types, queries
└── supabase/
    ├── migrations/  # Database migrations
    └── functions/   # Edge Functions
```

### Key Dependencies

#### Web (Next.js 15)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "openai": "^4.60.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@tanstack/react-query": "^5.56.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.446.0",
    "recharts": "^2.12.0",
    "react-dnd": "^16.0.0",
    "@tiptap/react": "^2.6.0"
  }
}
```

#### Mobile (Expo SDK 54)
```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-router": "~4.0.0",
    "react-native": "0.76.0",
    "@supabase/supabase-js": "^2.45.0",
    "expo-secure-store": "~14.0.0",
    "expo-sqlite": "~15.0.0",
    "expo-notifications": "~0.29.0",
    "nativewind": "^4.0.0"
  }
}
```

---

## 3. Database Schema

### Overview
- **Total Tables**: 34
- **Storage**: Supabase PostgreSQL with Row Level Security
- **Soft Delete**: All main tables include `deleted_at` column

### Table Categories

| Category | Tables |
|----------|--------|
| Users & Organization | profiles, companies, groups, user_groups, sessions, invite_links |
| Subscriptions | subscription_plans |
| Courses | courses, course_versions, modules, lessons, lesson_blocks, quizzes, quiz_questions, course_categories |
| Media | media, lesson_media |
| Enrollment | enrollments |
| Progress | user_course_progress, user_lesson_progress, quiz_attempts, activity_log |
| Certificates | certificates |
| Feedback | course_feedback |
| Reminders | reminders, reminder_templates |
| Notifications | notifications, email_queue |
| Billing | payments |
| Compliance | audit_log |
| Localization | languages, course_translations, lesson_translations |
| SCORM | scorm_packages, scorm_tracking |
| Requests | course_requests |

### Complete Schema (SQL)

```sql
-- =============================================
-- LMS PLATFORM - COMPLETE DATABASE SCHEMA
-- Version: 1.0
-- Tables: 34
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- SECTION 1: SUBSCRIPTION PLANS
-- =============================================

CREATE TABLE subscription_plans (
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

CREATE TABLE companies (
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

CREATE TABLE profiles (
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

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_groups (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, group_id)
);

-- =============================================
-- SECTION 5: SESSIONS
-- =============================================

CREATE TABLE sessions (
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

CREATE TABLE invite_links (
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

CREATE TABLE course_categories (
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

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES course_categories(id),
  original_prompt TEXT,
  passing_score INTEGER DEFAULT 70,
  settings JSONB DEFAULT '{}',
  creation_source TEXT CHECK (creation_source IN ('direct', 'request')) DEFAULT 'direct',
  course_request_id UUID,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 9: COURSE VERSIONS
-- =============================================

CREATE TABLE course_versions (
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

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 11: LESSONS
-- =============================================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 12: LESSON BLOCKS
-- =============================================

CREATE TABLE lesson_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'text', 'bullet_list', 'numbered_steps', 'accordion', 'flashcard',
    'callout', 'table', 'timeline', 'tabs', 'image', 'video',
    'checklist', 'quote', 'glossary', 'comparison', 'code', 'hotspot_image'
  )),
  content JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 13: QUIZZES
-- =============================================

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL UNIQUE REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 14: QUIZ QUESTIONS
-- =============================================

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 'multiple_select', 'true_false', 'fill_blank',
    'drag_match', 'drag_order', 'drag_category', 'hotspot', 'slider', 'short_answer'
  )),
  question_text TEXT NOT NULL,
  question_media JSONB,
  answer_config JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
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

CREATE TABLE media (
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

CREATE TABLE lesson_media (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (lesson_id, media_id)
);

-- =============================================
-- SECTION 16: COURSE REQUESTS
-- =============================================

CREATE TABLE course_requests (
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
ALTER TABLE courses ADD CONSTRAINT fk_course_request 
  FOREIGN KEY (course_request_id) REFERENCES course_requests(id) ON DELETE SET NULL;

-- =============================================
-- SECTION 17: ENROLLMENTS
-- =============================================

CREATE TABLE enrollments (
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

CREATE TABLE user_course_progress (
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

CREATE TABLE user_lesson_progress (
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

CREATE TABLE quiz_attempts (
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

CREATE TABLE activity_log (
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

CREATE TABLE certificates (
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

CREATE TABLE course_feedback (
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

CREATE TABLE reminder_templates (
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

CREATE TABLE reminders (
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

CREATE TABLE notifications (
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

CREATE TABLE email_queue (
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
-- SECTION 23: PAYMENTS
-- =============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id),
  payment_type TEXT CHECK (payment_type IN ('setup_fee', 'user_subscription')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JMD',
  ezee_transaction_id TEXT,
  user_count INTEGER,
  billing_period_start DATE,
  billing_period_end DATE,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SECTION 24: AUDIT LOG
-- =============================================

CREATE TABLE audit_log (
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
-- SECTION 25: LOCALIZATION
-- =============================================

CREATE TABLE languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Spanish'),
  ('fr', 'French');

CREATE TABLE course_translations (
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

CREATE TABLE lesson_translations (
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
-- SECTION 26: SCORM SUPPORT
-- =============================================

CREATE TABLE scorm_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  scorm_version TEXT CHECK (scorm_version IN ('1.2', '2004_3rd', '2004_4th')),
  package_url TEXT NOT NULL,
  manifest_data JSONB,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scorm_tracking (
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

CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_groups_company ON groups(company_id);
CREATE INDEX idx_user_groups_user ON user_groups(user_id);
CREATE INDEX idx_user_groups_group ON user_groups(group_id);
CREATE INDEX idx_sessions_user_active ON sessions(user_id) WHERE is_active = true;
CREATE INDEX idx_invite_links_company ON invite_links(company_id);
CREATE INDEX idx_invite_links_code ON invite_links(code);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lesson_blocks_lesson ON lesson_blocks(lesson_id);
CREATE INDEX idx_lesson_blocks_order ON lesson_blocks(lesson_id, sort_order);
CREATE INDEX idx_quizzes_module ON quizzes(module_id);
CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX idx_course_requests_company ON course_requests(company_id);
CREATE INDEX idx_course_requests_status ON course_requests(status);
CREATE INDEX idx_enrollments_company ON enrollments(company_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_group ON enrollments(group_id);
CREATE INDEX idx_enrollments_scheduled ON enrollments(scheduled_start_date) WHERE status = 'scheduled';
CREATE INDEX idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_activity_log_user_created ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_company_created ON activity_log(company_id, created_at DESC);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX idx_email_queue_pending ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_payments_company ON payments(company_id);
CREATE INDEX idx_audit_log_company_created ON audit_log(company_id, created_at DESC);

-- =============================================
-- VIEWS
-- =============================================

CREATE VIEW active_companies AS 
SELECT * FROM companies WHERE deleted_at IS NULL;

CREATE VIEW active_profiles AS 
SELECT * FROM profiles WHERE deleted_at IS NULL;

CREATE VIEW active_groups AS 
SELECT * FROM groups WHERE deleted_at IS NULL;

CREATE VIEW active_courses AS 
SELECT * FROM courses WHERE deleted_at IS NULL;

CREATE VIEW active_modules AS 
SELECT * FROM modules WHERE deleted_at IS NULL;

CREATE VIEW active_enrollments AS 
SELECT * FROM enrollments WHERE deleted_at IS NULL;
```

---

## 4. User Roles & Permissions

### Role Definitions

| Role | Access Level | Primary Functions |
|------|--------------|-------------------|
| Super Admin | Platform-wide | Create courses, manage companies, view all data |
| Company Admin | Company-wide | Manage team, assign courses, view company reports |
| User (Learner) | Personal | Complete courses, view certificates, track progress |

### Super Admin Capabilities

**Course Management**
- Create courses via AI or manually
- Edit and publish courses
- Manage course categories
- View and respond to course requests
- Assign courses to companies

**Company Management**
- Create and configure companies
- Invite company admins
- Manage subscription plans
- View company health metrics
- Access all company data

**Platform Management**
- View platform analytics
- Access audit logs
- Configure email templates
- Manage media library
- View AI usage and costs

### Company Admin Capabilities

**Team Management**
- Add users (single, bulk, invite link)
- Create and manage groups
- Assign users to groups
- Deactivate users
- View team activity

**Course Management**
- View available courses
- Assign courses to groups/users
- Schedule future enrollments
- Request new courses
- Send reminders

**Reporting**
- View completion reports
- Track progress by user/group
- Export data (tier-dependent)
- Access compliance reports

### User (Learner) Capabilities

**Learning**
- View assigned courses
- Complete lessons
- Take quizzes
- Track personal progress
- Download for offline (mobile)

**Profile**
- View certificates
- Manage notification preferences
- Update profile information

### Route Protection Matrix

| Route Pattern | Super Admin | Company Admin | User |
|---------------|-------------|---------------|------|
| `/super-admin/*` | ✓ | ✗ | ✗ |
| `/company-admin/*` | ✓ | ✓ | ✗ |
| `/learner/*` | ✓ | ✓ | ✓ |
| `/api/admin/*` | ✓ | ✗ | ✗ |
| `/api/company/*` | ✓ | ✓ | ✗ |

---

## 5. Feature Specifications

### 5.1 Content Block Types (17 Total)

| Block Type | Purpose | JSON Structure |
|------------|---------|----------------|
| `text` | Standard paragraphs | `{ "text": "content" }` |
| `bullet_list` | Unordered lists | `{ "title": "", "items": [] }` |
| `numbered_steps` | Procedures | `{ "title": "", "steps": [{ "title": "", "description": "" }] }` |
| `accordion` | Expandable sections | `{ "title": "", "sections": [{ "title": "", "content": "" }] }` |
| `flashcard` | Flip cards | `{ "cards": [{ "front": "", "back": "" }] }` |
| `callout` | Highlighted info | `{ "type": "tip|warning|note|danger", "title": "", "text": "" }` |
| `table` | Data tables | `{ "title": "", "headers": [], "rows": [[]] }` |
| `timeline` | Sequential events | `{ "title": "", "events": [{ "time": "", "title": "", "description": "" }] }` |
| `tabs` | Switchable panels | `{ "tabs": [{ "title": "", "content": "" }] }` |
| `image` | Visual with caption | `{ "url": "", "alt": "", "caption": "" }` |
| `video` | Embedded video | `{ "url": "", "thumbnail": "", "title": "", "duration_seconds": 0 }` |
| `checklist` | Interactive checkboxes | `{ "title": "", "items": [] }` |
| `quote` | Highlighted quote | `{ "text": "", "author": "", "source": "" }` |
| `glossary` | Term definitions | `{ "title": "", "terms": [{ "term": "", "definition": "" }] }` |
| `comparison` | Side-by-side (Do/Don't) | `{ "title": "", "left": { "label": "", "items": [] }, "right": { "label": "", "items": [] } }` |
| `code` | Formatted code | `{ "language": "", "code": "" }` |
| `hotspot_image` | Clickable areas | `{ "image_url": "", "title": "", "hotspots": [{ "x": 0, "y": 0, "label": "", "description": "" }] }` |

### 5.2 Quiz Question Types (10 Total)

| Question Type | Description | Answer Config |
|---------------|-------------|---------------|
| `multiple_choice` | Select one answer | `{ "options": [{ "id": "", "text": "" }], "shuffle": true }` |
| `multiple_select` | Select all correct | `{ "options": [], "min_selections": 1, "max_selections": 5 }` |
| `true_false` | Binary choice | `{}` |
| `fill_blank` | Type missing word(s) | `{ "blanks": [{ "id": "", "accepted_answers": [] }] }` |
| `drag_match` | Match pairs | `{ "items": [], "targets": [] }` |
| `drag_order` | Arrange in sequence | `{ "items": [], "shuffle": true }` |
| `drag_category` | Sort into categories | `{ "items": [], "categories": [] }` |
| `hotspot` | Click correct area | `{ "correct_regions": [{ "x": 0, "y": 0, "width": 0, "height": 0 }] }` |
| `slider` | Select value | `{ "min": 0, "max": 100, "step": 1, "tolerance": 5 }` |
| `short_answer` | Type response | `{ "min_words": 10, "max_words": 100, "keywords": [] }` |

### 5.3 User Addition Methods

**Method 1: Manual (One by One)**
```
Company Admin → Team → Add User → Enter name/email → Select group(s) → Send Invitation
```

**Method 2: Bulk CSV Upload**
```
Company Admin → Team → Add Users → Bulk Upload → Download template → Fill CSV → Upload → Review → Confirm
```

CSV Format:
```csv
email,full_name,groups
john@company.com,John Smith,"Sales Team,New Hires"
jane@company.com,Jane Doe,"Customer Service"
```

**Method 3: Shareable Invite Link**
```
Company Admin → Team → Invite Link → Configure options → Generate → Share link
```

Options:
- Expiry date (optional)
- Maximum uses (optional)
- Auto-assign to group (optional)

### 5.4 Course Creation Paths

**Path 1: Direct AI Creation**
```
Super Admin → Courses → Create New → AI Assisted → Enter prompt → Generate outline → 
Review/edit → Generate content → Review/edit → Generate quizzes → Add media → Publish
```

**Path 2: Direct Manual Creation**
```
Super Admin → Courses → Create New → Manual → Build structure → Add content blocks → 
Create quizzes → Add media → Publish
```

**Path 3: From Company Request**
```
Company Admin → Request New Course → Fill form → Submit
Super Admin → Course Requests → View request → Start AI Builder (pre-filled) → 
Generate → Review/edit → Publish → Notify Company Admin
```

### 5.5 Course Scheduling Flow

```
Day 0: Admin schedules course for Group X
       Start date: Jan 15, Due date: Jan 31
       └── Enrollment created: status = 'scheduled'
       └── Users receive "course scheduled" notification

Jan 15: System activates enrollment
       └── Status changes to 'active'
       └── Users receive "course available" notification
       └── Progress records created

Jan 31: Deadline passes
       └── Overdue users flagged
       └── Admin receives overdue report
```

### 5.6 Notification Types

| Trigger | Dashboard | Email | Push |
|---------|-----------|-------|------|
| Course assigned | ✓ | ✓ | ✓ |
| Course scheduled | ✓ | ✓ | ✓ |
| Scheduled course starts | ✓ | ✓ | ✓ |
| Deadline approaching (7 days) | ✓ | ✓ | Optional |
| Deadline approaching (1 day) | ✓ | ✓ | ✓ |
| Deadline passed | ✓ | ✓ | ✓ |
| Quiz passed | ✓ | Optional | Optional |
| Quiz failed | ✓ | ✓ | Optional |
| Course completed | ✓ | ✓ | ✓ |
| Certificate issued | ✓ | ✓ | ✓ |

---

## 6. Design System

### 6.1 Brand Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Deep Blue | `#1A4490` | 26, 68, 144 | Primary - headers, navigation, primary buttons |
| Teal | `#2BB5C5` | 43, 181, 197 | Accent - links, progress bars, interactive elements |
| Warm Gray | `#C4BEB5` | 196, 190, 181 | Neutral - borders, secondary backgrounds |
| White | `#FFFFFF` | 255, 255, 255 | Backgrounds |
| Dark Text | `#1A1A2E` | 26, 26, 46 | Primary text |
| Gray Text | `#64748B` | 100, 116, 139 | Secondary text |

### 6.2 Design Principles

**1. Clean & Uncluttered**
- Maximum 60% content density per screen
- Generous whitespace (24px minimum between sections)
- Single primary action per view
- Progressive disclosure for complex features

**2. Modern & Futuristic**
- Subtle shadows (`shadow-sm` to `shadow-md`)
- Rounded corners (`rounded-lg` default)
- Smooth transitions (`transition-all duration-200`)
- Glass morphism for overlays (sparingly)

**3. Professional & Simple**
- Consistent 4px/8px spacing grid
- Clear visual hierarchy
- No decorative elements without purpose
- Restrained color use

**4. Typography**
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### 6.3 Component Guidelines

**Buttons**
```jsx
// Primary (Deep Blue)
<button className="bg-[#1A4490] text-white px-4 py-2 rounded-lg hover:bg-[#153875] transition-colors">
  Primary Action
</button>

// Secondary (Outline)
<button className="border border-[#1A4490] text-[#1A4490] px-4 py-2 rounded-lg hover:bg-[#1A4490]/5 transition-colors">
  Secondary
</button>

// Accent (Teal)
<button className="bg-[#2BB5C5] text-white px-4 py-2 rounded-lg hover:bg-[#249AA8] transition-colors">
  Accent
</button>
```

**Cards**
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

**Inputs**
```jsx
<input 
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BB5C5] focus:border-transparent outline-none transition-all"
/>
```

**Progress Bars**
```jsx
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-[#1A4490] to-[#2BB5C5] transition-all duration-500"
    style={{ width: '45%' }}
  />
</div>
```

### 6.4 Layout Structure

**Sidebar Navigation (Desktop)**
- Width: 256px (expanded), 64px (collapsed)
- Background: White with subtle border
- Active item: Teal background with 10% opacity

**Header**
- Height: 64px
- Background: White
- Shadow: `shadow-sm`

**Content Area**
- Max width: 1280px
- Padding: 24px (desktop), 16px (mobile)
- Background: `#F8FAFC` (slate-50)

---

## 7. Project Structure

### 7.1 Monorepo Structure

```
lms-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── apps/
│   ├── web/                    # Next.js 15 Application
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (super-admin)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── ai-builder/
│   │   │   │   │   ├── [courseId]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── edit/
│   │   │   │   │   └── requests/
│   │   │   │   ├── companies/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   └── [companyId]/
│   │   │   │   ├── reports/
│   │   │   │   ├── media/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (company-admin)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── team/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── add/
│   │   │   │   │   ├── groups/
│   │   │   │   │   └── [userId]/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── assigned/
│   │   │   │   │   ├── schedule/
│   │   │   │   │   └── request/
│   │   │   │   ├── progress/
│   │   │   │   ├── reports/
│   │   │   │   ├── certificates/
│   │   │   │   ├── reminders/
│   │   │   │   ├── settings/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (learner)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [courseId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── learn/
│   │   │   │   │           └── [lessonId]/
│   │   │   │   ├── certificates/
│   │   │   │   ├── notifications/
│   │   │   │   ├── profile/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   └── webhooks/
│   │   │   │       └── ezee-payments/
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── modal.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── dropdown.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── toast.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   ├── mobile-nav.tsx
│   │   │   │   └── page-header.tsx
│   │   │   │
│   │   │   ├── course-builder/
│   │   │   │   ├── outline-generator.tsx
│   │   │   │   ├── lesson-editor.tsx
│   │   │   │   ├── block-editor.tsx
│   │   │   │   ├── quiz-editor.tsx
│   │   │   │   ├── media-picker.tsx
│   │   │   │   └── publish-modal.tsx
│   │   │   │
│   │   │   ├── course-player/
│   │   │   │   ├── lesson-viewer.tsx
│   │   │   │   ├── blocks/
│   │   │   │   │   ├── text-block.tsx
│   │   │   │   │   ├── accordion-block.tsx
│   │   │   │   │   ├── flashcard-block.tsx
│   │   │   │   │   ├── video-block.tsx
│   │   │   │   │   ├── image-block.tsx
│   │   │   │   │   ├── table-block.tsx
│   │   │   │   │   ├── comparison-block.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── quiz/
│   │   │   │   │   ├── quiz-player.tsx
│   │   │   │   │   ├── questions/
│   │   │   │   │   │   ├── multiple-choice.tsx
│   │   │   │   │   │   ├── drag-match.tsx
│   │   │   │   │   │   ├── fill-blank.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── quiz-results.tsx
│   │   │   │   └── progress-bar.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── activity-feed.tsx
│   │   │   │   ├── progress-chart.tsx
│   │   │   │   └── course-card.tsx
│   │   │   │
│   │   │   └── forms/
│   │   │       ├── course-request-form.tsx
│   │   │       ├── user-form.tsx
│   │   │       ├── group-form.tsx
│   │   │       └── company-form.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts
│   │   │   │   ├── server.ts
│   │   │   │   └── middleware.ts
│   │   │   │
│   │   │   ├── openai/
│   │   │   │   ├── client.ts
│   │   │   │   ├── prompts/
│   │   │   │   │   ├── course-outline.ts
│   │   │   │   │   ├── lesson-content.ts
│   │   │   │   │   ├── quiz-generation.ts
│   │   │   │   │   └── image-generation.ts
│   │   │   │   └── utils.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── formatting.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── dates.ts
│   │   │   │
│   │   │   └── constants.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-courses.ts
│   │   │   ├── use-progress.ts
│   │   │   ├── use-notifications.ts
│   │   │   └── use-media-upload.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.ts
│   │   │   ├── course-builder.ts
│   │   │   └── notifications.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── mobile/                 # Expo SDK 54 Application
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login.tsx
│       │   │   ├── register.tsx
│       │   │   └── _layout.tsx
│       │   │
│       │   ├── (company-admin)/
│       │   │   ├── (tabs)/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── team.tsx
│       │   │   │   ├── progress.tsx
│       │   │   │   ├── more.tsx
│       │   │   │   └── _layout.tsx
│       │   │   └── _layout.tsx
│       │   │
│       │   ├── (learner)/
│       │   │   ├── (tabs)/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── courses.tsx
│       │   │   │   ├── certificates.tsx
│       │   │   │   ├── profile.tsx
│       │   │   │   └── _layout.tsx
│       │   │   ├── courses/
│       │   │   │   └── [courseId]/
│       │   │   │       ├── index.tsx
│       │   │   │       └── learn/
│       │   │   │           └── [lessonId].tsx
│       │   │   └── _layout.tsx
│       │   │
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       │
│       ├── components/
│       ├── lib/
│       │   ├── supabase.ts
│       │   └── storage/
│       │       ├── database.ts
│       │       ├── sync.ts
│       │       └── queries.ts
│       │
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       ├── app.json
│       ├── eas.json
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── database.ts
│   │   │   │   ├── api.ts
│   │   │   │   ├── course.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── roles.ts
│   │   │   │   ├── status.ts
│   │   │   │   ├── block-types.ts
│   │   │   │   ├── question-types.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── database/
│       ├── src/
│       │   ├── types.ts
│       │   ├── queries.ts
│       │   └── index.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   │
│   ├── functions/
│   │   ├── generate-course-outline/
│   │   │   └── index.ts
│   │   ├── generate-lesson-content/
│   │   │   └── index.ts
│   │   ├── generate-quiz/
│   │   │   └── index.ts
│   │   ├── generate-image/
│   │   │   └── index.ts
│   │   ├── process-enrollment/
│   │   │   └── index.ts
│   │   ├── send-notifications/
│   │   │   └── index.ts
│   │   ├── send-emails/
│   │   │   └── index.ts
│   │   ├── generate-certificate/
│   │   │   └── index.ts
│   │   └── ezee-webhook/
│   │       └── index.ts
│   │
│   └── seed.sql
│
├── turbo.json
├── package.json
├── .env.example
└── README.md
```

### 7.2 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# eZeePayments
EZEE_MERCHANT_ID=your_merchant_id
EZEE_API_KEY=your_api_key
EZEE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_APP_NAME=Sales Master LMS

# Email (if using external service)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password
FROM_EMAIL=noreply@yourdomain.com
```

---

## 8. Implementation Phases

### Phase 1: Web Platform (16 Weeks)

#### 1A: Foundation (Weeks 1-2)

**Tasks:**
1. Initialize GitHub repository (private)
2. Set up Turborepo monorepo structure
3. Initialize Next.js 15 project
4. Configure Tailwind CSS with brand colors
5. Set up Supabase project
6. Deploy database schema (34 tables)
7. Configure Row Level Security policies
8. Implement Supabase Auth
9. Create authentication pages (login, register, forgot password)
10. Build base UI components (Button, Input, Card, Modal, Table)
11. Create layout components (Sidebar, Header)
12. Implement role-based route protection middleware
13. Set up TanStack Query
14. Configure Zustand stores

**Acceptance Criteria:**
- [ ] Users can register and login
- [ ] Role-based routing works correctly
- [ ] Database tables created and accessible
- [ ] Base UI components rendering correctly
- [ ] Layout matches design system

#### 1B: Super Admin Core (Weeks 3-4)

**Tasks:**
1. Build Super Admin dashboard
   - Stats cards (companies, users, courses, revenue)
   - Activity feed
   - Pending actions list
   - Company health overview
2. Implement Company management
   - Company list with search/filter
   - Create company form
   - Edit company details
   - Company branding settings
   - Deactivate company
3. Implement Company Admin invitations
   - Invite form
   - Email sending
   - Invitation tracking
4. Build subscription plan management
5. Create course categories management
6. Implement audit log viewer

**Acceptance Criteria:**
- [ ] Super Admin can view platform statistics
- [ ] Super Admin can create and manage companies
- [ ] Super Admin can invite Company Admins
- [ ] Subscription plans can be configured
- [ ] Audit logs are recorded and viewable

#### 1C: Company Admin Core (Weeks 5-6)

**Tasks:**
1. Build Company Admin dashboard
   - Team stats
   - Completion rates by group
   - Attention needed items
   - Upcoming deadlines
   - Recent completions
2. Implement user management
   - User list with search/filter
   - Add single user form
   - Bulk CSV upload
   - Generate invite link
   - Edit user details
   - Deactivate user
3. Implement group management
   - Group list
   - Create/edit group
   - Add/remove users from groups
4. Build company settings
   - Profile editing
   - Branding configuration (logo, colors)
   - Notification preferences

**Acceptance Criteria:**
- [ ] Company Admin sees their company dashboard
- [ ] Users can be added via form, CSV, or invite link
- [ ] Groups can be created and users assigned
- [ ] Company branding can be customized
- [ ] White-label theming applies correctly

#### 1D: Course Builder - AI (Weeks 7-9)

**Tasks:**
1. Build course request form (Company Admin)
2. Implement course request queue (Super Admin)
3. Create AI outline generator
   - Prompt input form
   - OpenAI integration
   - Outline preview
   - Edit outline interface
4. Implement AI content generator
   - Generate lesson blocks
   - Block type variety
   - Edit generated content
5. Build AI quiz generator
   - Generate questions (all 10 types)
   - Edit questions
   - Configure scoring
6. Create Supabase Edge Functions for AI calls

**Acceptance Criteria:**
- [ ] Company Admin can submit course requests
- [ ] Super Admin sees request queue with priorities
- [ ] AI generates course outline from prompt
- [ ] AI generates varied content blocks
- [ ] AI generates diverse quiz questions
- [ ] All generated content is editable

#### 1E: Course Builder - Media & Manual (Weeks 10-11)

**Tasks:**
1. Build media library
   - Grid view with filters
   - Search functionality
   - Usage tracking
2. Implement DALL-E integration
   - Prompt input
   - Image generation
   - Save to library
3. Build direct upload functionality
   - Drag and drop
   - Progress indicator
   - File validation
4. Implement URL linking
   - URL input
   - Preview
   - Download option
5. Create manual course builder
   - Course structure editor
   - Manual module/lesson creation
   - Manual block creation
6. Build AI assist for individual blocks
7. Implement course preview
8. Create course publishing flow
   - Version creation
   - Publish confirmation
   - Status update

**Acceptance Criteria:**
- [ ] Media library shows all assets
- [ ] DALL-E generates images from prompts
- [ ] Files can be uploaded directly
- [ ] External URLs can be linked
- [ ] Courses can be built entirely manually
- [ ] AI can assist with individual blocks
- [ ] Course preview works correctly
- [ ] Publishing creates a version

#### 1F: Course Assignment & Learning (Weeks 12-14)

**Tasks:**
1. Build course assignment interface
   - Super Admin assigns to companies
   - Company Admin assigns to groups/users
   - Setup fee configuration
2. Implement scheduling system
   - Schedule future enrollments
   - Background job for activation
   - Status transitions
3. Build learner dashboard
   - Course list (in progress, completed, scheduled)
   - Progress overview
   - Continue learning section
4. Create course player
   - Course overview page
   - Module/lesson navigation
   - Progress tracking
5. Implement all 17 content block renderers
6. Build quiz player
   - All 10 question types
   - Timer (if configured)
   - Submit and score
7. Implement quiz scoring and attempts
8. Build certificate generation
   - PDF creation
   - Verification code
   - Download functionality

**Acceptance Criteria:**
- [ ] Courses can be assigned to companies
- [ ] Courses can be assigned to groups/users
- [ ] Scheduling works correctly
- [ ] Learner dashboard shows all courses
- [ ] Course player navigates correctly
- [ ] All 17 block types render properly
- [ ] All 10 quiz types work correctly
- [ ] Certificates generate on completion

#### 1G: Notifications & Reminders (Week 15)

**Tasks:**
1. Set up email service
2. Create email templates
   - Welcome email
   - Course assigned
   - Course scheduled
   - Deadline approaching
   - Deadline passed
   - Course completed
   - Quiz results
3. Build dashboard notification system
   - Notification bell
   - Notification list
   - Mark as read
4. Implement notification preferences
5. Build reminder system
   - Manual reminders
   - Automated deadline reminders
   - Inactivity reminders (Professional+)
6. Create reminder templates (Professional+)

**Acceptance Criteria:**
- [ ] Emails send correctly
- [ ] All email templates work
- [ ] Dashboard notifications appear
- [ ] Users can manage preferences
- [ ] Reminders can be sent manually
- [ ] Automated reminders trigger correctly

#### 1H: Reporting & Payments (Week 16)

**Tasks:**
1. Build Super Admin reports
   - Platform overview
   - Revenue summary
   - Company health
   - AI usage and costs
2. Build Company Admin reports
   - Completion report
   - Progress by user/group
   - Overdue assignments
   - Compliance status (Professional+)
3. Implement CSV export
4. Set up eZeePayments integration
   - API configuration
   - Payment flow
   - Webhook handling
5. Build payment processing
   - Setup fees
   - Subscription billing
6. Create payment history view
7. Final testing and bug fixes
8. Performance optimization

**Acceptance Criteria:**
- [ ] All reports generate correctly
- [ ] Data exports work
- [ ] Payments process successfully
- [ ] Webhooks update payment status
- [ ] All features work end-to-end
- [ ] Performance is acceptable

---

### Phase 2: Mobile App (6 Weeks)

#### 2A: Mobile Foundation (Weeks 17-18)

**Tasks:**
1. Initialize Expo SDK 54 project
2. Configure Expo Router
3. Set up NativeWind (Tailwind)
4. Implement Supabase client
5. Build authentication screens
6. Create base mobile components
7. Implement tab navigation
8. Set up company branding/theming

**Acceptance Criteria:**
- [ ] Mobile app builds successfully
- [ ] Authentication works
- [ ] Navigation functions correctly
- [ ] Branding applies dynamically

#### 2B: Learner Experience (Weeks 19-20)

**Tasks:**
1. Build learner dashboard
2. Create course list views
3. Implement course player (mobile optimized)
4. Build all 17 block type renderers (mobile)
5. Implement quiz player (touch optimized)
6. Create certificates view
7. Set up push notifications
8. Build profile/settings screens

**Acceptance Criteria:**
- [ ] Learner can view all courses
- [ ] Course player works on mobile
- [ ] All blocks render correctly
- [ ] Quiz interactions work (drag-drop, etc.)
- [ ] Push notifications work
- [ ] Profile management works

#### 2C: Offline & Company Admin (Weeks 21-22)

**Tasks:**
1. Implement SQLite local database
2. Build course download feature
3. Create offline progress tracking
4. Implement background sync
5. Build Company Admin dashboard (limited)
   - Team progress view
   - Send reminders
   - View overdue
6. Cross-platform testing
7. App store preparation
   - Screenshots
   - Descriptions
   - Privacy policy

**Acceptance Criteria:**
- [ ] Courses can be downloaded
- [ ] Offline learning works
- [ ] Progress syncs when online
- [ ] Company Admin can view team
- [ ] App ready for store submission

---

## 9. API Architecture

### 9.1 Data Flow

```
CLIENT (Web/Mobile)
       │
       ├── Direct Database Operations (CRUD)
       │   Using Supabase Client + RLS
       │
       └── Complex Operations
           Via Supabase Edge Functions
           - AI generation
           - Payment processing
           - Email sending
           - Certificate generation
```

### 9.2 Direct Database Operations

Most CRUD operations use the Supabase client directly with Row Level Security:

```typescript
// Example: Fetch user's courses
const { data: courses, error } = await supabase
  .from('enrollments')
  .select(`
    *,
    course:courses(
      id,
      title,
      description,
      thumbnail_url,
      modules(
        id,
        title,
        lessons(id, title),
        quizzes(id, title)
      )
    )
  `)
  .eq('user_id', userId)
  .eq('status', 'active');
```

### 9.3 Edge Functions

| Function | Purpose | Trigger |
|----------|---------|---------|
| `generate-course-outline` | AI outline generation | Manual (Super Admin) |
| `generate-lesson-content` | AI content generation | Manual (Super Admin) |
| `generate-quiz` | AI quiz generation | Manual (Super Admin) |
| `generate-image` | DALL-E image generation | Manual (Super Admin) |
| `process-enrollment` | Activate scheduled enrollments | Cron (daily) |
| `send-notifications` | Process notification queue | Cron (every 5 min) |
| `send-emails` | Process email queue | Cron (every 5 min) |
| `generate-certificate` | Create PDF certificate | On course completion |
| `ezee-webhook` | Handle payment callbacks | Webhook (eZeePayments) |

### 9.4 Row Level Security Policies

```sql
-- Companies: Users can only see their own company
CREATE POLICY "Users see own company" ON companies
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE company_id = companies.id
    )
  );

-- Super Admin sees all
CREATE POLICY "Super admin sees all companies" ON companies
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'super_admin'
    )
  );

-- Users see own profile
CREATE POLICY "Users see own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Company Admin sees company users
CREATE POLICY "Company admin sees company users" ON profiles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'company_admin'
    )
  );

-- Similar patterns for all tables...
```

---

## 10. AI Integration

### 10.1 AI Provider

**Primary**: OpenAI (GPT-4o, DALL-E 3, Sora when available)

**Why GPT-4o:**
- Native JSON output mode
- Excellent instruction following
- Unified platform with DALL-E
- Cost-effective at scale

### 10.2 Course Outline Generation

```typescript
// System Prompt
const SYSTEM_PROMPT = `You are an expert instructional designer creating corporate training courses.
Generate clear, practical, engaging content suitable for adult learners.
Use simple language. Include real-world examples.`;

// User Prompt Template
const USER_PROMPT = `Create a course outline for: ${topic}

Target Audience: ${audience}
Industry: ${industry}
Tone: ${tone}
Structure: ${moduleCount} modules, ${lessonsPerModule} lessons per module

${topicsToCover ? `Topics to cover: ${topicsToCover}` : ''}
${companyContext ? `Company context: ${companyContext}` : ''}

Return a JSON object with this structure:
{
  "title": "Course title",
  "description": "Course description",
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "lessons": [
        {"title": "Lesson title", "summary": "Brief summary"}
      ],
      "quizTopic": "What the quiz covers"
    }
  ]
}`;
```

### 10.3 Lesson Content Generation

```typescript
const LESSON_PROMPT = `Create lesson content for:

Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}

Target Audience: ${audience}
Tone: ${tone}

Return content as an array of blocks using varied types:
- text, bullet_list, numbered_steps, accordion, flashcard
- callout, comparison, table, checklist, glossary

Return JSON:
{
  "blocks": [
    {"block_type": "text", "content": {...}},
    {"block_type": "bullet_list", "content": {...}},
    ...
  ],
  "suggested_media": [
    {"type": "image", "description": "...", "placement": "after_block_2"}
  ]
}`;
```

### 10.4 Quiz Generation

```typescript
const QUIZ_PROMPT = `Create a quiz for:

Module: ${moduleTitle}
Topics covered: ${topics}

Generate ${questionCount} questions with mix:
- 30% multiple_choice
- 20% true_false
- 20% drag_match or drag_order
- 20% fill_blank
- 10% multiple_select

Return JSON:
{
  "questions": [
    {
      "question_type": "multiple_choice",
      "question_text": "...",
      "answer_config": {...},
      "correct_answer": {...},
      "explanation": "..."
    }
  ]
}`;
```

### 10.5 Image Generation (DALL-E)

```typescript
const IMAGE_PROMPT = `Create a professional, clean illustration for corporate training.

Subject: ${description}
Style: Modern, minimalist, professional
Colors: Clean and corporate-appropriate

Do not include: Text, words, logos`;

// API Call
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: IMAGE_PROMPT,
  n: 1,
  size: "1024x1024",
  quality: "standard",
});
```

### 10.6 Estimated AI Costs

| Generation | Tokens (approx) | Cost (USD) |
|------------|-----------------|------------|
| Course outline | ~2,000 | $0.02 |
| Lesson content (x12) | ~24,000 | $0.30 |
| Quiz questions (x4 modules) | ~8,000 | $0.10 |
| Image prompts (x12) | ~3,000 | $0.04 |
| DALL-E images (x12) | - | $0.48 |
| **Total per course** | | **~$0.95** |

---

## 11. Authentication Flow

### 11.1 Login Flow

```
User enters email/password
       │
       ▼
Supabase Auth validates credentials
       │
       ├── Invalid → Show error
       │
       └── Valid → Get session
                      │
                      ▼
              Fetch user profile
              (role, company_id)
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
 Super Admin    Company Admin    Learner
  Dashboard       Dashboard      Dashboard
```

### 11.2 Registration Flow

**Standard Registration:**
```
User clicks "Register"
       │
       ▼
Enter name, email, password
       │
       ▼
Supabase Auth creates user
       │
       ▼
Profile created (role: 'user')
       │
       ▼
Redirect to learner dashboard
```

**Invite Link Registration:**
```
User clicks invite link (/join/{code})
       │
       ▼
Validate invite code
       │
       ├── Invalid/Expired → Show error
       │
       └── Valid → Show registration form
                      │
                      ▼
              Enter name, password
                      │
                      ▼
              Create user + profile
              (company_id from invite)
                      │
                      ▼
              Add to group (if specified)
                      │
                      ▼
              Increment invite use_count
                      │
                      ▼
              Redirect to dashboard
```

### 11.3 Middleware Protection

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(/* config */);
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const pathname = request.nextUrl.pathname;
    
    // Super Admin only routes
    if (pathname.startsWith('/super-admin') && profile?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    
    // Company Admin routes
    if (pathname.startsWith('/company-admin') && 
        !['super_admin', 'company_admin'].includes(profile?.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}
```

---

## 12. Acceptance Criteria

### Phase 1A: Foundation
- [ ] GitHub repository created and configured
- [ ] Monorepo structure working with Turborepo
- [ ] Next.js 15 running locally
- [ ] Tailwind configured with brand colors
- [ ] Supabase project created
- [ ] All 34 database tables deployed
- [ ] RLS policies in place
- [ ] Login page functional
- [ ] Registration page functional
- [ ] Forgot password flow working
- [ ] Role-based routing implemented
- [ ] Base UI components complete
- [ ] Layout components complete

### Phase 1B: Super Admin Core
- [ ] Dashboard shows accurate statistics
- [ ] Activity feed displays recent events
- [ ] Pending actions list updates correctly
- [ ] Company list with search and filter
- [ ] Create company flow complete
- [ ] Edit company details working
- [ ] Company branding saves correctly
- [ ] Company Admin invitations send
- [ ] Invitation status tracked
- [ ] Subscription plans manageable
- [ ] Course categories manageable
- [ ] Audit log displays events

### Phase 1C: Company Admin Core
- [ ] Dashboard shows company statistics
- [ ] Completion rates by group accurate
- [ ] Attention items displayed
- [ ] User list with search and filter
- [ ] Add single user works
- [ ] Bulk CSV upload works
- [ ] Invite link generation works
- [ ] Invite link usage tracking works
- [ ] Edit user details works
- [ ] Deactivate user works
- [ ] Group CRUD operations work
- [ ] User-group assignment works
- [ ] Company settings save
- [ ] Branding applies to UI

### Phase 1D: Course Builder - AI
- [ ] Course request form submits
- [ ] Request appears in queue
- [ ] Request priority displayed
- [ ] AI generates outline from prompt
- [ ] Outline displays correctly
- [ ] Outline editable
- [ ] AI generates lesson content
- [ ] Content uses varied block types
- [ ] Content editable
- [ ] AI generates quiz questions
- [ ] Questions use varied types
- [ ] Questions editable
- [ ] Edge functions deployed

### Phase 1E: Course Builder - Media & Manual
- [ ] Media library displays assets
- [ ] Media search works
- [ ] Media filter works
- [ ] DALL-E generates images
- [ ] Generated images save to library
- [ ] Direct upload works
- [ ] Upload progress shows
- [ ] File validation works
- [ ] URL linking works
- [ ] URL preview works
- [ ] Manual course creation works
- [ ] Manual module/lesson creation works
- [ ] All 17 block types creatable
- [ ] AI assist for individual blocks works
- [ ] Course preview accurate
- [ ] Course publishing creates version

### Phase 1F: Course Assignment & Learning
- [ ] Super Admin can assign to companies
- [ ] Company Admin can assign to groups
- [ ] Company Admin can assign to users
- [ ] Setup fee configurable
- [ ] Scheduling saves correctly
- [ ] Scheduled enrollments activate on date
- [ ] Learner dashboard shows courses
- [ ] In progress courses listed
- [ ] Completed courses listed
- [ ] Scheduled courses listed
- [ ] Course overview page accurate
- [ ] Module navigation works
- [ ] Lesson navigation works
- [ ] All 17 block types render
- [ ] Quiz player starts correctly
- [ ] All 10 question types work
- [ ] Quiz timer works (if enabled)
- [ ] Quiz scoring accurate
- [ ] Attempt count tracks
- [ ] Certificate generates on completion
- [ ] Certificate downloadable

### Phase 1G: Notifications & Reminders
- [ ] Emails send via configured service
- [ ] Welcome email sends
- [ ] Course assigned email sends
- [ ] Deadline emails send on schedule
- [ ] Dashboard notification bell works
- [ ] Notification count accurate
- [ ] Notification list displays
- [ ] Mark as read works
- [ ] Preferences save correctly
- [ ] Manual reminders send
- [ ] Automated reminders trigger

### Phase 1H: Reporting & Payments
- [ ] Platform overview report accurate
- [ ] Revenue report accurate
- [ ] Company health report works
- [ ] AI usage report shows costs
- [ ] Completion report accurate
- [ ] Progress by user/group works
- [ ] Overdue report accurate
- [ ] CSV export works
- [ ] eZeePayments integration working
- [ ] Setup fees process correctly
- [ ] Subscription billing works
- [ ] Webhooks update payment status
- [ ] Payment history displays

### Phase 2A: Mobile Foundation
- [ ] Expo project builds (iOS)
- [ ] Expo project builds (Android)
- [ ] Navigation works
- [ ] Login works
- [ ] Registration works
- [ ] Session persists
- [ ] Branding applies

### Phase 2B: Mobile Learner
- [ ] Dashboard loads correctly
- [ ] Course list accurate
- [ ] Course player navigates
- [ ] All blocks render (mobile)
- [ ] Quiz interactions work
- [ ] Push notifications receive
- [ ] Certificates viewable
- [ ] Profile manageable

### Phase 2C: Offline & Company Admin
- [ ] Download course works
- [ ] Offline progress saves
- [ ] Sync uploads progress
- [ ] Company Admin dashboard works
- [ ] Team progress viewable
- [ ] Reminders sendable
- [ ] App store ready

---

## Appendix A: Quick Reference - Block Type JSON

### Text Block
```json
{
  "block_type": "text",
  "content": {
    "text": "Paragraph content with **markdown** support."
  }
}
```

### Bullet List
```json
{
  "block_type": "bullet_list",
  "content": {
    "title": "Key Points",
    "items": ["Point 1", "Point 2", "Point 3"]
  }
}
```

### Numbered Steps
```json
{
  "block_type": "numbered_steps",
  "content": {
    "title": "How to...",
    "steps": [
      {"title": "Step 1", "description": "Description"},
      {"title": "Step 2", "description": "Description"}
    ]
  }
}
```

### Accordion
```json
{
  "block_type": "accordion",
  "content": {
    "title": "FAQ",
    "sections": [
      {"title": "Question 1", "content": "Answer 1"},
      {"title": "Question 2", "content": "Answer 2"}
    ]
  },
  "settings": {
    "allow_multiple_open": false
  }
}
```

### Flashcard
```json
{
  "block_type": "flashcard",
  "content": {
    "cards": [
      {"front": "Term", "back": "Definition"},
      {"front": "Question", "back": "Answer"}
    ]
  },
  "settings": {
    "shuffle": false,
    "show_progress": true
  }
}
```

### Callout
```json
{
  "block_type": "callout",
  "content": {
    "type": "warning",
    "title": "Important",
    "text": "This is important information."
  }
}
```
Types: `tip`, `warning`, `note`, `danger`, `info`

### Table
```json
{
  "block_type": "table",
  "content": {
    "title": "Data Table",
    "headers": ["Column 1", "Column 2", "Column 3"],
    "rows": [
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"]
    ]
  }
}
```

### Comparison
```json
{
  "block_type": "comparison",
  "content": {
    "title": "Do vs Don't",
    "left": {
      "label": "Do",
      "type": "positive",
      "items": ["Good practice 1", "Good practice 2"]
    },
    "right": {
      "label": "Don't",
      "type": "negative",
      "items": ["Bad practice 1", "Bad practice 2"]
    }
  }
}
```

---

## Appendix B: Quick Reference - Question Type JSON

### Multiple Choice
```json
{
  "question_type": "multiple_choice",
  "question_text": "What is the correct answer?",
  "answer_config": {
    "options": [
      {"id": "a", "text": "Option A"},
      {"id": "b", "text": "Option B"},
      {"id": "c", "text": "Option C"},
      {"id": "d", "text": "Option D"}
    ],
    "shuffle": true
  },
  "correct_answer": {"selected": "b"},
  "explanation": "B is correct because..."
}
```

### Multiple Select
```json
{
  "question_type": "multiple_select",
  "question_text": "Select all correct answers:",
  "answer_config": {
    "options": [
      {"id": "a", "text": "Option A"},
      {"id": "b", "text": "Option B"},
      {"id": "c", "text": "Option C"}
    ],
    "min_selections": 1,
    "max_selections": 3
  },
  "correct_answer": {"selected": ["a", "c"]},
  "partial_credit": true
}
```

### True/False
```json
{
  "question_type": "true_false",
  "question_text": "The sky is blue.",
  "answer_config": {},
  "correct_answer": {"selected": true},
  "explanation": "The sky appears blue due to..."
}
```

### Fill in Blank
```json
{
  "question_type": "fill_blank",
  "question_text": "The capital of France is ___.",
  "answer_config": {
    "blanks": [
      {
        "id": "blank1",
        "accepted_answers": ["Paris", "paris"],
        "case_sensitive": false
      }
    ]
  },
  "correct_answer": {"blank1": "Paris"}
}
```

### Drag Match
```json
{
  "question_type": "drag_match",
  "question_text": "Match the items:",
  "answer_config": {
    "items": [
      {"id": "1", "text": "Item A"},
      {"id": "2", "text": "Item B"}
    ],
    "targets": [
      {"id": "a", "text": "Target 1"},
      {"id": "b", "text": "Target 2"}
    ]
  },
  "correct_answer": {
    "matches": {"1": "a", "2": "b"}
  }
}
```

### Drag Order
```json
{
  "question_type": "drag_order",
  "question_text": "Arrange in correct order:",
  "answer_config": {
    "items": [
      {"id": "1", "text": "Step 1"},
      {"id": "2", "text": "Step 2"},
      {"id": "3", "text": "Step 3"}
    ],
    "shuffle": true
  },
  "correct_answer": {
    "order": ["1", "2", "3"]
  }
}
```

---

## Appendix C: Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          'deep-blue': '#1A4490',
          'teal': '#2BB5C5',
          'warm-gray': '#C4BEB5',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#1A4490',
          600: '#153875',
          700: '#102C5A',
          800: '#0C2040',
          900: '#081425',
        },
        accent: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#2BB5C5',
          500: '#249AA8',
          600: '#1D7F8B',
          700: '#16646E',
          800: '#0F4951',
          900: '#082E34',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## Document End

**Version**: 1.0
**Last Updated**: December 2025
**Platform Owner**: Sales Master Consultants

This document serves as the complete specification for building the LMS platform. Follow the implementation phases in order, completing all acceptance criteria before moving to the next phase.
