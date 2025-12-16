# LMS Platform - Complete Database Schema Guide

## Overview

This document provides a comprehensive overview of the LMS Platform database schema, which consists of **48 tables** organized into logical sections.

## Table of Contents

1. [Quick Stats](#quick-stats)
2. [Table Categories](#table-categories)
3. [Table Descriptions](#table-descriptions)
4. [Relationships](#relationships)
5. [Indexes](#indexes)
6. [Security (RLS)](#security-rls)
7. [Usage](#usage)

---

## Quick Stats

- **Total Tables**: 48
- **Views**: 6
- **Functions**: 4
- **Triggers**: Auto-generated for all tables with `updated_at`
- **Database**: PostgreSQL (via Supabase)
- **Extensions**: uuid-ossp, pgcrypto

---

## Table Categories

| Category | Tables | Count |
|----------|--------|-------|
| Core System | subscription_plans, companies, profiles | 3 |
| User Management | groups, user_groups, sessions, invite_links | 4 |
| Course Structure | course_categories, courses, course_versions, modules, lessons, lesson_blocks | 6 |
| Assessments | quizzes, quiz_questions | 2 |
| Media | media, lesson_media | 2 |
| Course Requests | course_requests | 1 |
| Enrollment | enrollments | 1 |
| Progress Tracking | user_course_progress, user_lesson_progress, quiz_attempts, activity_log | 4 |
| Certificates | certificates | 1 |
| Feedback | course_feedback | 1 |
| Reminders | reminder_templates, reminders | 2 |
| Notifications | notifications, email_queue | 2 |
| Pricing System | course_pricing, company_pricing_overrides, course_activations, invoices, invoice_items, expiry_reminders | 6 |
| Payments | payments | 1 |
| Audit | audit_log | 1 |
| Localization | languages, course_translations, lesson_translations | 3 |
| SCORM | scorm_packages, scorm_tracking | 2 |

---

## Table Descriptions

### Core System Tables

#### `subscription_plans`
Defines the three subscription tiers (Standard, Professional, Enterprise) with their pricing and feature limits.

**Key Fields:**
- `tier`: standard, professional, enterprise
- `per_user_monthly`: Monthly cost per user
- `max_users`: Maximum number of users allowed
- `features`: JSONB containing feature flags

#### `companies`
Multi-tenant support - each company is a separate tenant with its own users, courses, and branding.

**Key Fields:**
- `slug`: Unique identifier for URL routing
- `logo_url`: Custom branding
- `primary_color`, `secondary_color`: Brand colors (#1A4490, #2BB5C5)
- `subscription_plan_id`: Links to subscription tier
- `deleted_at`: Soft delete support

#### `profiles`
User profiles linked to Supabase auth.users. Three roles: super_admin, company_admin, user.

**Key Fields:**
- `id`: References auth.users(id)
- `role`: Determines access level
- `company_id`: Multi-tenant link
- `preferences`: JSONB for user settings

---

### User Management Tables

#### `groups`
Organizational groups within a company (e.g., "Sales Team", "New Hires").

#### `user_groups`
Many-to-many relationship between users and groups.

#### `sessions`
Tracks user login sessions across web and mobile platforms.

**Key Fields:**
- `device_type`: web, mobile_ios, mobile_android
- `is_active`: For session management

#### `invite_links`
Shareable invitation codes for self-registration.

**Key Fields:**
- `code`: Unique invite code
- `expires_at`: Optional expiration
- `max_uses`: Optional usage limit
- `group_id`: Auto-assign to group on signup

---

### Course Structure Tables

#### `course_categories`
Top-level course categories (e.g., "Sales Training", "Safety").

#### `courses`
Main course table with comprehensive fields.

**Key Fields (Course Intro):**
- `overview`: 2-3 sentence description
- `objectives`: Array of learning objectives
- `target_audience`: Who should take this
- `prerequisites`: Prior knowledge needed

**Key Fields (Course Outro):**
- `course_summary`: Congratulations message
- `next_steps`: What to do after completion
- `resources`: Additional materials

**Key Fields (Settings):**
- `passing_score`: Default 70%
- `award_certificate`: Enable/disable certificates
- `is_published`: Publish status

#### `course_versions`
Versioning system for published courses. Captures complete snapshots.

#### `modules`
Course sections/chapters within a course.

**Key Fields:**
- `introduction`: Opening text for module
- `summary`: Key takeaways
- `sort_order`: Display order

#### `lessons`
Individual learning units within modules.

#### `lesson_blocks`
Content blocks within lessons (17+ types supported).

**Supported Block Types:**
- Text & Basic: text, heading, quote, divider
- Lists & Steps: bullet_list, numbered_list, numbered_steps, checklist
- Media: image, video, audio, file
- Interactive: accordion, tabs, flashcard, hotspot_image
- Callouts: callout (tip, warning, note, danger)
- Data: table, comparison, timeline, stats, code, glossary

**Structure:**
- `block_type`: Type identifier
- `content`: JSONB containing block-specific data
- `settings`: JSONB for block settings
- `sort_order`: Display order

---

### Assessment Tables

#### `quizzes`
One quiz per module (1:1 relationship).

**Key Fields:**
- `passing_score`: Default 70%
- `max_attempts`: Default 3
- `shuffle_questions`: Randomize question order
- `show_correct_answers`: Post-submission feedback

#### `quiz_questions`
Individual quiz questions (10 types supported).

**Supported Question Types:**
1. `multiple_choice`: Single correct answer
2. `multiple_select`: Multiple correct answers
3. `true_false`: Binary choice
4. `fill_blank`: Text input
5. `drag_match`: Match pairs
6. `drag_order`: Sequence items
7. `drag_category`: Sort into groups
8. `hotspot`: Click on image
9. `slider`: Select on scale
10. `short_answer`: Free text response

**Structure:**
- `question_text`: Question content
- `answer_config`: JSONB with question-specific configuration
- `correct_answer`: JSONB with correct answer(s)
- `explanation`: Why this is the correct answer
- `points`: Score value (default 1)
- `partial_credit`: Allow partial points

---

### Media Tables

#### `media`
Central media library for all assets.

**Source Types:**
- `ai_generated`: Generated by DALL-E
- `direct_upload`: User uploaded
- `external_url`: Linked from external source
- `library_copy`: Copied from another asset

**Key Fields:**
- `file_url`: Asset location
- `file_type`: image, video, document, audio
- `ai_prompt`: Original DALL-E prompt
- `ai_cost`: Track AI generation costs
- `usage_count`: How many times used

#### `lesson_media`
Links media assets to lessons.

---

### Course Request Tables

#### `course_requests`
Company admins can request new courses from Super Admin.

**Request Fields:**
- `course_topic`: What they want to learn
- `target_audience`: Who it's for
- `desired_modules`: Suggested structure
- `tone`: formal, conversational, technical
- `priority`: low, normal, high, urgent

**Workflow Fields:**
- `status`: pending → in_review → approved → in_progress → completed
- `reviewed_by`: Super Admin who reviewed
- `course_id`: Links to created course

---

### Enrollment Tables

#### `enrollments`
Assigns courses to users or groups.

**Key Features:**
- Can assign to individual user OR entire group
- Supports scheduled enrollments (start in future)
- Tracks setup fees
- Soft delete support

**Status Flow:**
- `scheduled`: Not started yet
- `active`: Currently available
- `completed`: User finished
- `cancelled`: Enrollment cancelled

---

### Progress Tracking Tables

#### `user_course_progress`
Tracks overall course progress per user.

**Key Fields:**
- `progress_percentage`: 0-100%
- `total_time_spent_seconds`: Total learning time
- `final_score`: Quiz average
- `passed`: Did they pass?
- `is_overdue`: Auto-calculated based on due_date

#### `user_lesson_progress`
Tracks individual lesson completion.

**Key Fields:**
- `status`: not_started, in_progress, completed
- `time_spent_seconds`: Time on lesson
- `video_watch_percentage`: For video lessons

#### `quiz_attempts`
Tracks each quiz attempt.

**Key Fields:**
- `attempt_number`: 1, 2, 3...
- `score`: Points earned
- `passed`: Met passing score?
- `answers`: JSONB with all answers

#### `activity_log`
Records all learning activities.

**Activity Types:**
- login, course_started, course_completed
- lesson_started, lesson_completed
- quiz_started, quiz_completed, quiz_failed
- video_watched, certificate_earned

---

### Certificate Tables

#### `certificates`
Stores earned certificates.

**Key Fields:**
- `certificate_number`: Unique identifier (e.g., "CERT-2024-0001")
- `verification_code`: For public verification
- `pdf_url`: Generated certificate PDF
- `expires_at`: Optional expiration

---

### Feedback Tables

#### `course_feedback`
Users rate and review completed courses.

**Key Fields:**
- `rating`: 1-5 stars
- `comment`: Text feedback
- Unique constraint: One review per user per course

---

### Reminder Tables

#### `reminder_templates`
Reusable reminder templates (Professional+ tier).

**Key Fields:**
- `title_template`: Template with placeholders
- `message_template`: Body with placeholders
- `trigger_days_before_deadline`: Auto-trigger timing

#### `reminders`
Individual reminder instances.

**Types:**
- deadline_approaching, overdue
- course_assigned, inactivity
- quiz_retry_available, custom

**Delivery:**
- email, push, both

---

### Notification Tables

#### `notifications`
In-app notifications.

**Types:**
- course_scheduled, course_enrolled
- deadline_approaching, deadline_overdue
- quiz_passed, quiz_failed
- course_completed, reminder, system

#### `email_queue`
Outbound email queue for async processing.

**Email Types:**
- course_scheduled, course_enrolled
- deadline_reminder, overdue_notice
- course_completed, quiz_results
- welcome, password_reset, custom

**Status Flow:**
- pending → sent (success)
- pending → failed (retry with exponential backoff)

---

### Pricing System Tables

#### `course_pricing`
Global default pricing per course.

**Key Fields:**
- `setup_fee`: One-time activation cost
- `reactivation_fee`: Cost to renew
- `seat_fee`: Per-user cost (12 months)
- `currency`: JMD (Jamaican Dollar)

#### `company_pricing_overrides`
Custom pricing for specific companies.

**Override Levels:**
1. Course-specific: `course_id` = specific course UUID
2. Company-wide: `course_id` = NULL (applies to all courses)

**Priority:**
Course-specific override → Company-wide override → Global default

#### `course_activations`
Tracks which companies have access to which courses.

**Key Features:**
- 12-month validity period
- Tracks seat count
- Renewal tracking
- Expiry management

**Status:**
- `pending_payment`: Waiting for payment
- `active`: Company has access
- `expired`: Access has expired

#### `invoices`
Professional invoices with line items.

**Key Fields:**
- `invoice_number`: Auto-generated (INV-YYYY-NNNN)
- `subtotal`, `tax_rate`, `tax_amount`, `total`
- `status`: draft, sent, paid, overdue, cancelled
- `due_date`: 14 days from issue

#### `invoice_items`
Line items on invoices.

**Item Types:**
- `setup_fee`: Course activation fee
- `reactivation_fee`: Renewal fee
- `seat_fee`: Per-user licensing
- `other`: Custom items

#### `expiry_reminders`
Tracks which expiry reminders have been sent.

**Reminder Schedule:**
- 30 days before expiry
- 7 days before expiry
- 1 day before expiry
- 0 days (expired)

Unique constraint prevents duplicate reminders.

---

### Payment Tables

#### `payments`
Records all payments processed.

**Payment Types:**
- `setup_fee`: One-time setup
- `user_subscription`: Monthly/annual billing
- `course_activation`: Course access payment

**Key Fields:**
- `ezee_transaction_id`: eZeePayments reference
- `status`: pending, completed, failed
- `metadata`: JSONB for additional data

---

### Audit Tables

#### `audit_log`
Security and compliance audit trail.

**Tracked Actions:**
- user_created, user_updated, user_deleted
- group_created, course_assigned
- settings_changed, export_requested
- login, login_failed, password_changed

**Key Fields:**
- `actor_id`, `actor_email`, `actor_role`
- `target_type`, `target_id`
- `ip_address`, `user_agent`
- `details`: JSONB with change details

---

### Localization Tables

#### `languages`
Supported languages (English, Spanish, French).

#### `course_translations`
Translated course metadata.

#### `lesson_translations`
Translated lesson content.

**Key Features:**
- Track if AI-translated
- Track manual review status

---

### SCORM Tables

#### `scorm_packages`
SCORM content packages (Enterprise tier).

**Versions:**
- SCORM 1.2
- SCORM 2004 3rd Edition
- SCORM 2004 4th Edition

#### `scorm_tracking`
Tracks SCORM completion data.

**Standard Fields:**
- completion_status, success_status
- score_raw, score_min, score_max
- total_time, suspend_data

---

## Relationships

### Primary Relationships

```
companies (1) ─── (M) profiles
companies (1) ─── (M) groups
companies (1) ─── (M) course_activations

profiles (M) ─── (M) groups (via user_groups)
profiles (1) ─── (M) enrollments
profiles (1) ─── (M) user_course_progress

courses (1) ─── (M) modules
modules (1) ─── (M) lessons
lessons (1) ─── (M) lesson_blocks
modules (1) ─── (1) quizzes
quizzes (1) ─── (M) quiz_questions

courses (1) ─── (M) enrollments
users + courses ─── (1) user_course_progress
users + lessons ─── (1) user_lesson_progress
users + quizzes ─── (M) quiz_attempts
```

### Pricing Relationships

```
courses (1) ─── (1) course_pricing
companies + courses ─── (0/1) company_pricing_overrides
companies + courses ─── (M) course_activations
course_activations (1) ─── (1) invoices
invoices (1) ─── (M) invoice_items
```

---

## Indexes

All tables have optimized indexes for:
- Foreign keys
- Frequently queried columns
- Sort orders
- Composite lookups

**Key Indexes:**
- `idx_profiles_company`: User company lookups
- `idx_courses_published`: Published course filtering
- `idx_enrollments_user`: User enrollment queries
- `idx_user_course_progress_user`: Progress tracking
- `idx_notifications_user_unread`: Unread notification counts
- `idx_email_queue_pending`: Email queue processing

---

## Security (RLS)

All tables have Row Level Security enabled.

### Policy Structure

1. **Super Admin**: Full access to everything
2. **Company Admin**: Access to own company data
3. **User**: Access to own data only
4. **Public**: Published courses readable by authenticated users

### Key Policies

```sql
-- Super Admin sees everything
CREATE POLICY "Super admin full access" ON {table}
  FOR ALL USING (user is super_admin);

-- Users see own data
CREATE POLICY "Users see own data" ON {table}
  FOR SELECT USING (auth.uid() = user_id);

-- Published courses are public
CREATE POLICY "Published courses viewable" ON courses
  FOR SELECT USING (is_published = true);
```

---

## Usage

### Setup

1. **Run complete schema:**
   ```bash
   psql -h your-db-host -U postgres -d your-db-name -f complete_database_schema.sql
   ```

2. **Or use Supabase CLI:**
   ```bash
   supabase db reset
   ```

### Migrations

Existing migration files in `supabase/migrations/`:
- `002_pricing_configuration.sql` (deprecated, superseded by 003)
- `003_course_based_pricing.sql` (pricing system)
- `004_categories_super_admin_rls.sql` (category policies)
- `005_course_versions.sql` (versioning)

### Adding New Tables

1. Add table definition to `complete_database_schema.sql`
2. Add indexes for foreign keys
3. Enable RLS
4. Add appropriate policies
5. Update this documentation

### Helper Functions

#### `get_effective_price(course_id, company_id)`
Returns the final price considering overrides.

```sql
SELECT * FROM get_effective_price(
  'course-uuid'::UUID,
  'company-uuid'::UUID
);
-- Returns: setup_fee, reactivation_fee, seat_fee, currency
```

#### `generate_invoice_number()`
Generates sequential invoice numbers.

```sql
SELECT generate_invoice_number();
-- Returns: 'INV-2024-0001'
```

---

## Best Practices

### Soft Deletes

Tables with `deleted_at` support soft deletes:
- companies, profiles, groups
- courses, modules, lessons
- enrollments

Always use views for active records:
```sql
SELECT * FROM active_companies;
SELECT * FROM active_courses;
```

### Timestamps

All tables have:
- `created_at`: Auto-set on insert
- `updated_at`: Auto-updated on change (via trigger)

### JSONB Fields

Use JSONB for flexible data:
- `settings`: Configuration options
- `preferences`: User preferences
- `metadata`: Additional context
- `content`: Block content
- `features`: Plan features

### UUIDs

All primary keys use UUID v4 (via `gen_random_uuid()`).

---

## Maintenance

### Regular Tasks

1. **Vacuum**: Run weekly
   ```sql
   VACUUM ANALYZE;
   ```

2. **Check indexes**: Monthly
   ```sql
   SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
   ```

3. **Monitor size**: Monthly
   ```sql
   SELECT
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

---

## Version History

- **v1.0** (Current): Initial complete schema with 48 tables
  - Core LMS functionality
  - Course builder with content blocks
  - Pricing and invoicing system
  - Localization support
  - SCORM integration

---

## Support

For questions or issues:
1. Check the Project Guide folder for detailed specifications
2. Review the LMS_PROJECT_GUIDE.md for business logic
3. See COURSE_BUILDER_GUIDE.md for content structure
4. See PRICING_SYSTEM.md for billing details

---

**Last Updated**: December 2024
**Schema Version**: 1.0
**Total Tables**: 48
