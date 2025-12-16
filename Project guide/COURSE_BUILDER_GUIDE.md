# LMS Platform - Course Builder Guide

## Overview

This document defines the complete course structure, builder interface, and implementation details for the Sales Master LMS platform. The course builder supports three creation methods: Manual, AI-Generated, and Drag-and-Drop.

---

## Course Philosophy

Every course follows a **standard educational structure** like a training manual:

1. **Course Intro** - Set expectations before learning begins
2. **Modules** - Logical sections of content
3. **Lessons** - Individual learning units within modules
4. **Quizzes** - Assess understanding per module
5. **Course Outro** - Wrap up and next steps

---

## Complete Course Structure

```
COURSE
│
├── COURSE INTRO (Before learning starts)
│   ├── Overview (What is this course about?)
│   ├── Objectives (What will you learn?)
│   ├── Target Audience (Who is this for?)
│   ├── Prerequisites (What should you know first?)
│   └── Duration (How long will it take?)
│
├── MODULE 1: [Topic]
│   ├── Module Introduction (What this module covers)
│   ├── Lesson 1.1
│   ├── Lesson 1.2
│   ├── Lesson 1.3
│   ├── Module Summary (Key takeaways)
│   └── Quiz 1
│
├── MODULE 2: [Topic]
│   ├── Module Introduction
│   ├── Lessons...
│   ├── Module Summary
│   └── Quiz 2
│
├── MODULE 3: [Topic]
│   └── ...
│
└── COURSE OUTRO (After learning ends)
    ├── Course Summary (Everything you learned)
    ├── Next Steps (What to do now)
    ├── Resources (Additional reading/links)
    └── Certificate (Congratulations!)
```

---

## Data Models

### Course

```typescript
interface Course {
  // Basic Info
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  category_id: string | null;
  
  // Course Intro Section
  overview: string;                    // 2-3 sentence description
  objectives: string[];                // Learning objectives (action verbs)
  target_audience: string[];           // Who should take this course
  prerequisites: string[];             // Prior knowledge needed
  estimated_duration_minutes: number;  // Total course time
  
  // Course Outro Section
  course_summary: string;              // Congratulations + recap
  next_steps: string;                  // What to do after completion
  resources: Resource[];               // Additional materials
  
  // Settings
  passing_score: number;               // Default 70
  award_certificate: boolean;          // Default true
  is_published: boolean;
  published_at: string | null;
  
  // AI Generation
  original_prompt: string | null;      // If AI-generated
  
  // Meta
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // Relations
  modules: Module[];
}

interface Resource {
  title: string;
  url: string;
  type: 'link' | 'pdf' | 'video';
}
```

### Module

```typescript
interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  introduction: string;                // Opening text for module
  summary: string;                     // Key takeaways
  sort_order: number;
  estimated_duration_minutes: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  lessons: Lesson[];
  quiz: Quiz | null;
}
```

### Lesson

```typescript
interface Lesson {
  id: string;
  module_id: string;
  title: string;
  sort_order: number;
  estimated_duration_minutes: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  content_blocks: ContentBlock[];
}
```

### Content Block

```typescript
interface ContentBlock {
  id: string;
  lesson_id: string;
  type: ContentBlockType;
  content: ContentBlockContent;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type ContentBlockType = 
  | 'text'
  | 'video'
  | 'image'
  | 'bullet_list'
  | 'numbered_steps'
  | 'callout'
  | 'quote'
  | 'accordion'
  | 'table'
  | 'tabs'
  | 'checklist'
  | 'code'
  | 'flashcard'
  | 'timeline'
  | 'comparison'
  | 'glossary'
  | 'hotspot_image';

// Content varies by type
interface TextContent {
  text: string;  // Supports markdown
}

interface VideoContent {
  url: string;
  title: string;
  duration_seconds: number;
}

interface ImageContent {
  url: string;
  alt: string;
  caption?: string;
}

interface BulletListContent {
  items: string[];
}

interface NumberedStepsContent {
  steps: {
    title: string;
    description: string;
  }[];
}

interface CalloutContent {
  type: 'tip' | 'warning' | 'note' | 'danger' | 'info';
  title?: string;
  text: string;
}

interface QuoteContent {
  text: string;
  author?: string;
  source?: string;
}

interface AccordionContent {
  items: {
    title: string;
    content: string;
  }[];
}

interface TableContent {
  headers: string[];
  rows: string[][];
}

interface TabsContent {
  tabs: {
    label: string;
    content: string;
  }[];
}

interface ChecklistContent {
  title?: string;
  items: {
    text: string;
    checked: boolean;
  }[];
}

interface CodeContent {
  language: string;
  code: string;
  filename?: string;
}

interface FlashcardContent {
  cards: {
    front: string;
    back: string;
  }[];
}

interface TimelineContent {
  events: {
    date: string;
    title: string;
    description: string;
  }[];
}

interface ComparisonContent {
  title?: string;
  columns: {
    header: string;
    items: string[];
  }[];
}

interface GlossaryContent {
  terms: {
    term: string;
    definition: string;
  }[];
}

interface HotspotImageContent {
  image_url: string;
  hotspots: {
    x: number;  // Percentage
    y: number;  // Percentage
    title: string;
    description: string;
  }[];
}
```

### Quiz

```typescript
interface Quiz {
  id: string;
  module_id: string;
  title: string;
  description: string;
  passing_score: number;      // Default 70
  max_attempts: number;       // Default 3
  time_limit_minutes: number | null;
  shuffle_questions: boolean;
  show_correct_answers: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[] | null;
  correct_answer: string | string[];
  explanation: string | null;
  points: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type QuestionType = 
  | 'multiple_choice'    // Single correct answer
  | 'multiple_select'    // Multiple correct answers
  | 'true_false'         // True or False
  | 'fill_blank'         // Fill in the blank
  | 'drag_match'         // Match items
  | 'drag_order'         // Put in order
  | 'drag_category'      // Sort into categories
  | 'hotspot'            // Click on image
  | 'slider'             // Select value on scale
  | 'short_answer';      // Free text response

interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}
```

---

## Database Schema Updates

Run this SQL to add new fields:

```sql
-- ============================================================================
-- UPDATE COURSES TABLE
-- ============================================================================

ALTER TABLE courses ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS objectives JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS target_audience JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_summary TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS next_steps TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS award_certificate BOOLEAN DEFAULT true;

-- ============================================================================
-- UPDATE MODULES TABLE
-- ============================================================================

ALTER TABLE modules ADD COLUMN IF NOT EXISTS introduction TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 0;

-- ============================================================================
-- UPDATE LESSONS TABLE
-- ============================================================================

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 0;

-- ============================================================================
-- CREATE CONTENT BLOCKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_blocks_lesson ON content_blocks(lesson_id);
CREATE INDEX idx_content_blocks_order ON content_blocks(lesson_id, sort_order);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Super admin full access
CREATE POLICY "Super admins have full access to content_blocks"
ON content_blocks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- UPDATE QUIZZES TABLE
-- ============================================================================

ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS shuffle_questions BOOLEAN DEFAULT false;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS show_correct_answers BOOLEAN DEFAULT true;
```

---

## Course Builder UI

### Step 1: Course Setup (Intro Section)

**Route:** `/super-admin/courses/new` or `/super-admin/courses/[id]/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | Text | Yes | Course name |
| Category | Select | Yes | From course_categories |
| Thumbnail | Image Upload | No | AI generate option available |
| Overview | Textarea | Yes | 2-3 sentences about the course |
| Objectives | List (dynamic) | Yes | Action verb statements |
| Target Audience | List (dynamic) | Yes | Who should take this |
| Prerequisites | List (dynamic) | No | Prior knowledge needed |
| Duration | Number | Auto | Calculated from lessons |

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Create New Course                                    Step 1 of 4   │
│  ● Course Setup  ○ Modules  ○ Content  ○ Completion                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Course Title *                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Category *                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Select a category...                                    ▼   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Thumbnail                                                          │
│  ┌─────────────────────┐                                           │
│  │                     │  [Upload Image]                           │
│  │   [Placeholder]     │  [🤖 Generate with AI]                    │
│  │                     │                                           │
│  └─────────────────────┘                                           │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Course Overview *                              [🤖 Generate with AI]│
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  Brief description of what this course is about (2-3 sentences)   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Learning Objectives *                          [🤖 Generate with AI]│
│  By the end of this course, learners will be able to:             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✓ Objective 1                                           [×] │   │
│  │ ✓ Objective 2                                           [×] │   │
│  │ ✓ Objective 3                                           [×] │   │
│  │ [+ Add Objective]                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Target Audience *                              [🤖 Generate with AI]│
│  This course is designed for:                                      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ • Audience 1                                            [×] │   │
│  │ • Audience 2                                            [×] │   │
│  │ [+ Add Audience]                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Prerequisites (Optional)                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [+ Add Prerequisite]                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                                                                     │
│                                       [Cancel]  [Save & Continue →] │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Step 2: Module Builder

**Route:** `/super-admin/courses/[id]/modules`

**Features:**
- Add/edit/delete modules
- Drag to reorder modules
- Add lessons within modules
- Configure module intro and summary
- Add quiz to module

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Create New Course                                    Step 2 of 4   │
│  ✓ Course Setup  ● Modules  ○ Content  ○ Completion                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MODULES                          [🤖 Generate All Modules with AI] │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ≡  MODULE 1                                         [✎] [×] │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  Title: Understanding Your Customer                         │   │
│  │  Description: Learn what customers really want...           │   │
│  │                                                              │   │
│  │  ┌─ Introduction ─────────────────────────────────────────┐ │   │
│  │  │ In this module, you'll discover...                     │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  Lessons:                                                    │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │ ≡  📄 Lesson 1: Customer Expectations          [✎] [×] │ │   │
│  │  │ ≡  📄 Lesson 2: Active Listening               [✎] [×] │ │   │
│  │  │ ≡  📄 Lesson 3: Reading Body Language          [✎] [×] │ │   │
│  │  │ [+ Add Lesson]                                          │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  ┌─ Summary ──────────────────────────────────────────────┐ │   │
│  │  │ Key takeaways from this module...                      │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  │                                                              │   │
│  │  Quiz: ✓ 5 questions                                [Edit]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ≡  MODULE 2                                         [✎] [×] │   │
│  │  Title: Communication Skills                                │   │
│  │  ...                                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ Add Module]                                                     │
│                                                                     │
│                                       [← Back]  [Save & Continue →] │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Step 3: Lesson Content Editor

**Route:** `/super-admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]`

**Features:**
- Drag-and-drop content blocks
- Live preview
- AI content generation
- Image/video upload
- Rich text editing

**UI Layout (Split View):**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Edit Lesson: Customer Expectations                                 │
│  Course > Module 1 > Lesson 1                      [Preview] [Save] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌────────────────────────────────────────┐  │
│  │                  │  │                                        │  │
│  │  ADD CONTENT     │  │  LESSON CONTENT                        │  │
│  │                  │  │                                        │  │
│  │  ─────────────── │  │  ┌────────────────────────────────┐   │  │
│  │                  │  │  │ ≡ TEXT BLOCK              [×]  │   │  │
│  │  📝 Text         │  │  │ Understanding what customers   │   │  │
│  │  🎬 Video        │  │  │ expect is the foundation...    │   │  │
│  │  🖼️ Image        │  │  └────────────────────────────────┘   │  │
│  │  • Bullet List   │  │                                        │  │
│  │  1. Numbered     │  │  ┌────────────────────────────────┐   │  │
│  │  💡 Callout      │  │  │ ≡ BULLET LIST             [×]  │   │  │
│  │  " Quote         │  │  │ • Quick response times         │   │  │
│  │  ▼ Accordion     │  │  │ • Knowledgeable staff          │   │  │
│  │  📊 Table        │  │  │ • Friendly attitude            │   │  │
│  │  ☐ Checklist     │  │  └────────────────────────────────┘   │  │
│  │  </> Code        │  │                                        │  │
│  │  🔄 Flashcard    │  │  ┌────────────────────────────────┐   │  │
│  │  📅 Timeline     │  │  │ ≡ CALLOUT (Tip)           [×]  │   │  │
│  │  ⚖️ Comparison   │  │  │ 💡 Always greet customers      │   │  │
│  │  📖 Glossary     │  │  │ within 30 seconds of arrival.  │   │  │
│  │  🎯 Hotspot      │  │  └────────────────────────────────┘   │  │
│  │                  │  │                                        │  │
│  │  ─────────────── │  │  [+ Add Block]                        │  │
│  │                  │  │                                        │  │
│  │  [🤖 Generate    │  │                                        │  │
│  │   Lesson with AI]│  │                                        │  │
│  │                  │  │                                        │  │
│  └──────────────────┘  └────────────────────────────────────────┘  │
│                                                                     │
│                                               [← Back to Module]    │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Step 4: Course Completion Setup

**Route:** `/super-admin/courses/[id]/completion`

**Fields:**
- Course Summary
- Next Steps
- Additional Resources
- Passing Score
- Certificate Settings

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Create New Course                                    Step 4 of 4   │
│  ✓ Course Setup  ✓ Modules  ✓ Content  ● Completion                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  COURSE COMPLETION                                                  │
│                                                                     │
│  Course Summary *                               [🤖 Generate with AI]│
│  Congratulations message and recap of what was learned             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Congratulations on completing Customer Service Excellence!  │   │
│  │ You've learned how to understand customer needs...          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Next Steps                                     [🤖 Generate with AI]│
│  What should learners do after completing this course?             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Practice these techniques with your next customers.         │   │
│  │ Share your certificate with your manager.                   │   │
│  │ Consider taking the Advanced Customer Service course.       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Additional Resources (Optional)                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Title        │ URL                               │ Type │ × │   │
│  │──────────────────────────────────────────────────────────── │   │
│  │ Handbook     │ https://...                       │ PDF  │ × │   │
│  │ [+ Add Resource]                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  SETTINGS                                                           │
│                                                                     │
│  Passing Score          [70] %                                      │
│  Award Certificate      [✓]                                        │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  PUBLISH OPTIONS                                                    │
│                                                                     │
│  Status: Draft                                                      │
│                                                                     │
│                          [← Back]  [Save as Draft]  [Publish Now]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quiz Builder

**Route:** `/super-admin/courses/[id]/modules/[moduleId]/quiz`

**Question Types:**

| Type | Description | UI |
|------|-------------|-----|
| Multiple Choice | One correct answer | Radio buttons |
| Multiple Select | Multiple correct answers | Checkboxes |
| True/False | Binary choice | Two buttons |
| Fill in Blank | Text input | Input field |
| Drag Match | Match pairs | Drag connectors |
| Drag Order | Sequence items | Drag to reorder |
| Drag Category | Sort into groups | Drag to columns |
| Hotspot | Click on image | Image with markers |
| Slider | Select on scale | Range slider |
| Short Answer | Free text | Textarea |

**UI Layout:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  Quiz: Module 1 Assessment                                          │
│  Course > Module 1 > Quiz                          [Preview] [Save] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Settings                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Passing Score: [70]%  │ Max Attempts: [3]  │ Time Limit: [ ] │   │
│  │ [✓] Shuffle Questions  │ [✓] Show Correct Answers After     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Questions                            [🤖 Generate Questions with AI]│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ≡  Question 1                              [Edit] [Delete] │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  Type: Multiple Choice                                      │   │
│  │  Q: What is the most important factor in customer service?  │   │
│  │  ○ Speed   ○ Price   ● Empathy   ○ Location                │   │
│  │  Points: 1                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ≡  Question 2                              [Edit] [Delete] │   │
│  │  Type: True/False                                           │   │
│  │  Q: Active listening requires making eye contact.           │   │
│  │  ● True   ○ False                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [+ Add Question]                                                   │
│                                                                     │
│                                               [← Back to Module]    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AI Course Generation

### Full Course Generation Flow

**Route:** `/super-admin/courses/new?mode=ai`

```
┌─────────────────────────────────────────────────────────────────────┐
│  🤖 Generate Course with AI                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  What course would you like to create?                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Create a customer service training course for retail        │   │
│  │ employees. Focus on handling complaints, upselling, and     │   │
│  │ building customer loyalty. Include practical examples.      │   │
│  │                                                              │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Generation Options                                                 │
│                                                                     │
│  Number of Modules:    [3 ▼]                                       │
│  Lessons per Module:   [3 ▼]                                       │
│  Quiz Questions:       [5 ▼] per module                            │
│  Tone:                 [Professional ▼]                            │
│  Difficulty:           [Intermediate ▼]                            │
│  Generate Images:      [✓]                                         │
│                                                                     │
│                                              [Cancel]  [Generate →] │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### AI Generation API Prompt Template

```typescript
const generateCoursePrompt = (userPrompt: string, options: GenerationOptions) => `
You are creating a professional corporate training course.

USER REQUEST:
${userPrompt}

REQUIREMENTS:
- Generate a complete course structure
- Use clear, professional language
- Include practical, real-world examples
- Focus on actionable learning outcomes

OUTPUT STRUCTURE:
{
  "title": "Course Title",
  "overview": "2-3 sentence description",
  "objectives": ["Objective 1 (start with action verb)", "Objective 2", ...],
  "target_audience": ["Audience 1", "Audience 2", ...],
  "prerequisites": ["Prerequisite 1", ...] or [],
  "estimated_duration_minutes": number,
  
  "modules": [
    {
      "title": "Module Title",
      "description": "Brief module description",
      "introduction": "Opening paragraph for this module",
      "lessons": [
        {
          "title": "Lesson Title",
          "content_blocks": [
            {
              "type": "text",
              "content": { "text": "Lesson content..." }
            },
            {
              "type": "bullet_list",
              "content": { "items": ["Point 1", "Point 2"] }
            },
            {
              "type": "callout",
              "content": { "type": "tip", "text": "Helpful tip..." }
            }
          ]
        }
      ],
      "summary": "Key takeaways from this module",
      "quiz_questions": [
        {
          "question_text": "Question?",
          "question_type": "multiple_choice",
          "options": [
            { "text": "Option A", "is_correct": false },
            { "text": "Option B", "is_correct": true },
            { "text": "Option C", "is_correct": false }
          ],
          "explanation": "Why B is correct...",
          "points": 1
        }
      ]
    }
  ],
  
  "course_summary": "Congratulations message and recap",
  "next_steps": "What to do after completing this course"
}

Generate ${options.moduleCount} modules with ${options.lessonsPerModule} lessons each.
Include ${options.quizQuestionsPerModule} quiz questions per module.
Tone: ${options.tone}
Difficulty: ${options.difficulty}
`;
```

---

## Course Player (Learner View)

### Course Overview Page

**Route:** `/courses/[slug]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  [← Back to Courses]                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                                                                │ │
│  │  [THUMBNAIL IMAGE]                                             │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Customer Service Excellence                                        │
│  ═══════════════════════════                                        │
│                                                                     │
│  OVERVIEW                                                           │
│  This course teaches you how to deliver exceptional customer       │
│  service that builds loyalty and drives growth.                    │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  WHAT YOU'LL LEARN                                                  │
│  ✓ Understand customer expectations                                 │
│  ✓ Handle difficult situations professionally                       │
│  ✓ Use communication techniques that build trust                    │
│  ✓ Turn complaints into opportunities                               │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  WHO THIS IS FOR                                                    │
│  • Customer service representatives                                 │
│  • Sales associates                                                 │
│  • Anyone who interacts with customers                              │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ⏱ 2 hours  │  📚 3 modules  │  📝 15 questions  │  🎓 Certificate  │
│                                                                     │
│                                              [Start Course →]       │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  COURSE CONTENT                                                     │
│                                                                     │
│  ▼ Module 1: Understanding Your Customer            25 min          │
│    ├── Lesson 1: Customer Expectations                              │
│    ├── Lesson 2: Active Listening                                   │
│    ├── Lesson 3: Reading Body Language                              │
│    └── Quiz (5 questions)                                           │
│                                                                     │
│  ▶ Module 2: Communication Skills                   30 min          │
│                                                                     │
│  ▶ Module 3: Handling Difficult Situations          25 min          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Course Player (Learning View)

**Route:** `/courses/[slug]/learn/[lessonId]`

```
┌─────────────────────────────────────────────────────────────────────┐
│  Customer Service Excellence                [Progress: ████░░ 67%] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────┐  ┌──────────────────────────────────────────┐  │
│  │                │  │                                          │  │
│  │  CONTENTS      │  │  Lesson 1: Customer Expectations         │  │
│  │                │  │  ════════════════════════════════════    │  │
│  │  Module 1 ▼    │  │                                          │  │
│  │   ✓ Intro      │  │  [VIDEO PLAYER]                          │  │
│  │   ● Lesson 1   │  │                                          │  │
│  │   ○ Lesson 2   │  │  Understanding what customers expect is  │  │
│  │   ○ Lesson 3   │  │  the foundation of great service. When   │  │
│  │   ○ Summary    │  │  customers feel heard and valued, they   │  │
│  │   ○ Quiz       │  │  become loyal advocates for your brand.  │  │
│  │                │  │                                          │  │
│  │  Module 2 ▶    │  │  Key Customer Expectations:              │  │
│  │  Module 3 ▶    │  │  • Quick response times                  │  │
│  │                │  │  • Knowledgeable staff                   │  │
│  │                │  │  • Friendly, professional attitude       │  │
│  │                │  │  • Solutions to their problems           │  │
│  │                │  │                                          │  │
│  │                │  │  ┌────────────────────────────────────┐  │  │
│  │                │  │  │ 💡 TIP                             │  │  │
│  │                │  │  │ Always greet customers within 30   │  │  │
│  │                │  │  │ seconds of their arrival.          │  │  │
│  │                │  │  └────────────────────────────────────┘  │  │
│  │                │  │                                          │  │
│  └────────────────┘  └──────────────────────────────────────────┘  │
│                                                                     │
│                      [← Previous]  [Mark Complete ✓]  [Next →]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
apps/web/src/
├── app/
│   ├── super-admin/
│   │   └── courses/
│   │       ├── page.tsx                    # Course list
│   │       ├── new/
│   │       │   └── page.tsx                # New course (step 1)
│   │       └── [id]/
│   │           ├── page.tsx                # Course overview/edit
│   │           ├── edit/
│   │           │   └── page.tsx            # Edit course info
│   │           ├── modules/
│   │           │   ├── page.tsx            # Module builder (step 2)
│   │           │   └── [moduleId]/
│   │           │       ├── page.tsx        # Module edit
│   │           │       ├── lessons/
│   │           │       │   └── [lessonId]/
│   │           │       │       └── page.tsx # Lesson editor (step 3)
│   │           │       └── quiz/
│   │           │           └── page.tsx    # Quiz builder
│   │           └── completion/
│   │               └── page.tsx            # Completion setup (step 4)
│   │
│   ├── company-admin/
│   │   └── courses/
│   │       └── page.tsx                    # View assigned courses
│   │
│   └── learner/
│       └── courses/
│           ├── page.tsx                    # My courses
│           └── [slug]/
│               ├── page.tsx                # Course overview
│               └── learn/
│                   └── [lessonId]/
│                       └── page.tsx        # Course player
│
├── components/
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseForm.tsx
│   │   ├── ModuleList.tsx
│   │   ├── ModuleForm.tsx
│   │   ├── LessonList.tsx
│   │   └── LessonForm.tsx
│   │
│   ├── content-blocks/
│   │   ├── BlockRenderer.tsx               # Renders any block type
│   │   ├── BlockEditor.tsx                 # Edits any block type
│   │   ├── TextBlock.tsx
│   │   ├── VideoBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── BulletListBlock.tsx
│   │   ├── NumberedStepsBlock.tsx
│   │   ├── CalloutBlock.tsx
│   │   ├── QuoteBlock.tsx
│   │   ├── AccordionBlock.tsx
│   │   ├── TableBlock.tsx
│   │   ├── ChecklistBlock.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── FlashcardBlock.tsx
│   │   ├── TimelineBlock.tsx
│   │   ├── ComparisonBlock.tsx
│   │   ├── GlossaryBlock.tsx
│   │   └── HotspotBlock.tsx
│   │
│   ├── quiz/
│   │   ├── QuizBuilder.tsx
│   │   ├── QuizPlayer.tsx
│   │   ├── QuestionForm.tsx
│   │   ├── MultipleChoiceQuestion.tsx
│   │   ├── TrueFalseQuestion.tsx
│   │   ├── FillBlankQuestion.tsx
│   │   ├── DragMatchQuestion.tsx
│   │   ├── DragOrderQuestion.tsx
│   │   └── HotspotQuestion.tsx
│   │
│   └── player/
│       ├── CoursePlayer.tsx
│       ├── LessonSidebar.tsx
│       ├── ProgressBar.tsx
│       └── NavigationButtons.tsx
│
├── actions/
│   ├── courses.ts                          # Course CRUD
│   ├── modules.ts                          # Module CRUD
│   ├── lessons.ts                          # Lesson CRUD
│   ├── content-blocks.ts                   # Content block CRUD
│   ├── quizzes.ts                          # Quiz CRUD
│   └── ai-generation.ts                    # AI course generation
│
└── lib/
    ├── course-utils.ts                     # Helper functions
    └── ai-prompts.ts                       # AI prompt templates
```

---

## Implementation Priority

### Phase 1: Core Structure
1. Database schema updates
2. Course CRUD (basic info)
3. Module CRUD
4. Lesson CRUD (without content blocks)
5. Basic course listing

### Phase 2: Content Blocks
1. Content block database table
2. Block renderer component
3. Block editor component
4. Implement each block type (start with text, bullet, callout)

### Phase 3: Quiz System
1. Quiz CRUD
2. Question CRUD
3. Quiz player component
4. Score calculation

### Phase 4: AI Generation
1. OpenAI integration
2. Full course generation
3. Individual section generation
4. Image generation (DALL-E)

### Phase 5: Course Player
1. Course overview page
2. Lesson player
3. Progress tracking
4. Quiz taking experience
5. Completion & certificate

---

## Summary

This course builder provides:

1. **Structured Template** - Every course follows the same professional format
2. **Flexible Content** - 17 different content block types
3. **Multiple Creation Modes** - Manual, AI-generated, or hybrid
4. **Drag-and-Drop** - Reorder modules, lessons, and content blocks
5. **Quiz Support** - 10 question types with scoring
6. **Progress Tracking** - Track learner completion
7. **Mobile Responsive** - Works on all devices
