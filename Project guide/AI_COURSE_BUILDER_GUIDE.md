# LMS Platform - AI Course Builder Guide

## Overview

This document defines the complete AI-powered course generation system, including user flows, intelligent content block selection, and cutting-edge implementation details.

---

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Progressive Generation** | Generate outline first, then expand each part |
| **Preview Before Commit** | User sees and approves everything before saving |
| **Selective Regeneration** | Regenerate any part without losing other work |
| **Intelligent Block Selection** | AI chooses best blocks for content type |
| **Cost Transparency** | Show estimated cost before generation |
| **Human in the Loop** | User can edit AI output at every step |

---

## User Flow: Complete Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   STEP 1              STEP 2              STEP 3              STEP 4        │
│   Course Setup   →    AI Outline     →    Content Gen    →    Review &      │
│   (User Input)        (Generate)          (Per Lesson)        Publish       │
│                                                                             │
│   • Topic             • Title             • Blocks            • Preview     │
│   • Audience          • Modules           • Images            • Edit        │
│   • Structure         • Lessons           • Quizzes           • Publish     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# STEP 1: Course Setup

## What User Sees

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Create New Course                                              Step 1 of 4 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  How would you like to create this course?                                  │
│                                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                  │
│  │                         │  │                         │                  │
│  │    🤖 AI-Powered        │  │    ✏️ Manual Build      │                  │
│  │                         │  │                         │                  │
│  │  Describe your topic    │  │  Build from scratch     │                  │
│  │  and AI creates the     │  │  with full control      │                  │
│  │  entire course          │  │                         │                  │
│  │                         │  │                         │                  │
│  │         ● Selected      │  │         ○               │                  │
│  └─────────────────────────┘  └─────────────────────────┘                  │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  COURSE TOPIC *                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Customer Service Excellence for Retail Staff                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DETAILED DESCRIPTION (What should this course cover?)                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Train retail employees on providing exceptional customer service.   │   │
│  │ Cover greeting customers, handling complaints, upselling,          │   │
│  │ dealing with difficult situations, and building loyalty.           │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  TARGET AUDIENCE                           INDUSTRY                         │
│  ┌────────────────────────────────┐       ┌────────────────────────────┐   │
│  │ New retail employees        ▼  │       │ Retail                  ▼  │   │
│  └────────────────────────────────┘       └────────────────────────────┘   │
│                                                                             │
│  TONE                                      COURSE CATEGORY                  │
│  ┌────────────────────────────────┐       ┌────────────────────────────┐   │
│  │ Conversational              ▼  │       │ Customer Service        ▼  │   │
│  └────────────────────────────────┘       └────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  COURSE STRUCTURE                                                           │
│                                                                             │
│  Number of Modules:                        Lessons per Module:              │
│  ┌─────┐                                   ┌─────┐                         │
│  │  4  │  [−] [+]                          │  3  │  [−] [+]                │
│  └─────┘                                   └─────┘                         │
│                                                                             │
│  ☑ Include quiz at end of each module                                      │
│  ☑ Generate images for lessons                                             │
│  ☐ Generate videos (coming soon)                                           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💰 ESTIMATED COST                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Text Generation (GPT-4o):    ~$0.45                                │   │
│  │  Image Generation (DALL-E):   ~$1.60 (8 images)                     │   │
│  │  ─────────────────────────────────────────────                      │   │
│  │  Total Estimated:             ~$2.05                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                                                             │
│                                          [Cancel]  [Generate Outline →]    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Form Fields

| Field | Type | Required | Options |
|-------|------|----------|---------|
| Course Topic | Text input | Yes | - |
| Description | Textarea | No | Helps AI understand scope |
| Target Audience | Dropdown | Yes | New employees, Managers, All staff, Technical, Non-technical |
| Industry | Dropdown | Yes | Retail, Healthcare, Finance, Technology, Manufacturing, Hospitality, Other |
| Tone | Dropdown | Yes | Conversational, Formal, Technical |
| Category | Dropdown | Yes | From course_categories table |
| Module Count | Number stepper | Yes | 2-8, default 4 |
| Lessons per Module | Number stepper | Yes | 2-5, default 3 |
| Include Quizzes | Checkbox | Yes | Default checked |
| Generate Images | Checkbox | Yes | Default checked |

---

# STEP 2: AI Outline Generation

## What Happens Behind the Scenes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Generating Course Outline...                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  45%            │   │
│  │                                                                      │   │
│  │  ✓ Analyzing topic and requirements                                 │   │
│  │  ✓ Researching best practices                                       │   │
│  │  ● Structuring modules and lessons...                               │   │
│  │  ○ Generating learning objectives                                   │   │
│  │  ○ Creating quiz topics                                             │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              [Cancel Generation]                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## AI Prompt: Outline Generation

```typescript
const OUTLINE_SYSTEM_PROMPT = `You are an expert instructional designer specializing in corporate training.

Your role:
- Create clear, practical, engaging course structures
- Design content suitable for adult learners in workplace settings
- Use evidence-based learning principles (chunking, repetition, active learning)
- Ensure logical flow from basic to advanced concepts

Guidelines:
- Each module should have a clear theme
- Lessons should be completable in 5-15 minutes
- Include variety: concepts, procedures, scenarios, practice
- End each module with measurable learning outcomes`;

const OUTLINE_USER_PROMPT = `Create a comprehensive course outline.

COURSE TOPIC: ${topic}
DETAILED DESCRIPTION: ${description}
TARGET AUDIENCE: ${audience}
INDUSTRY: ${industry}
TONE: ${tone}

STRUCTURE:
- ${moduleCount} modules
- ${lessonsPerModule} lessons per module
- Include quiz at end of each module: ${includeQuizzes}

Return a JSON object with this exact structure:
{
  "title": "Engaging course title",
  "description": "2-3 sentence description that sells the course",
  "estimated_duration_minutes": number,
  "learning_objectives": ["objective 1", "objective 2", "objective 3"],
  "target_audience": "Who this course is for",
  "prerequisites": "What learners should know beforehand (or 'None')",
  "modules": [
    {
      "title": "Module title",
      "description": "What this module covers",
      "learning_outcomes": ["outcome 1", "outcome 2"],
      "estimated_duration_minutes": number,
      "lessons": [
        {
          "title": "Lesson title",
          "summary": "One sentence describing the lesson",
          "key_topics": ["topic 1", "topic 2"],
          "estimated_duration_minutes": number,
          "suggested_content_types": ["text", "scenario", "checklist"]
        }
      ],
      "quiz": {
        "focus_areas": ["area 1", "area 2"],
        "suggested_question_count": number
      }
    }
  ]
}`;
```

## What User Sees: Outline Review

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Review Course Outline                                          Step 2 of 4 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  CUSTOMER SERVICE EXCELLENCE FOR RETAIL                               │ │
│  │  ═══════════════════════════════════════════════════════════════════  │ │
│  │                                                                        │ │
│  │  Master the art of exceptional customer service. Learn to create      │ │
│  │  memorable experiences that turn first-time buyers into loyal         │ │
│  │  customers.                                                           │ │
│  │                                                             [✏️ Edit]  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Duration: ~45 minutes  │  4 Modules  │  12 Lessons  │  4 Quizzes         │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  MODULE 1: First Impressions Matter                          [🔄] [✏️] [×] │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Creating positive first impressions that set the tone for the       │ │
│  │  entire customer experience.                                          │ │
│  │                                                                        │ │
│  │  📚 Lessons:                                                          │ │
│  │  ├─ 1.1 The Power of a Warm Greeting              ~5 min    [✏️] [×] │ │
│  │  │      Key: body language, tone of voice, timing                    │ │
│  │  ├─ 1.2 Reading Customer Cues                     ~5 min    [✏️] [×] │ │
│  │  │      Key: busy vs browsing, mood recognition                      │ │
│  │  └─ 1.3 Making Every Customer Feel Welcome        ~5 min    [✏️] [×] │ │
│  │         Key: inclusivity, personalization                            │ │
│  │                                                                        │ │
│  │  📝 Quiz: 5 questions on greetings and first impressions             │ │
│  │                                                                        │ │
│  │  [+ Add Lesson]                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  MODULE 2: Handling Customer Needs                           [🔄] [✏️] [×] │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Understanding and addressing what customers really want.            │ │
│  │                                                                        │ │
│  │  📚 Lessons:                                                          │ │
│  │  ├─ 2.1 Active Listening Techniques               ~5 min    [✏️] [×] │ │
│  │  ├─ 2.2 Asking the Right Questions                ~5 min    [✏️] [×] │ │
│  │  └─ 2.3 Recommending Products with Confidence     ~5 min    [✏️] [×] │ │
│  │                                                                        │ │
│  │  📝 Quiz: 5 questions                                                 │ │
│  │                                                                        │ │
│  │  [+ Add Lesson]                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  MODULE 3: Handling Difficult Situations                     [🔄] [✏️] [×] │
│  └─ ... (collapsed, click to expand)                                       │
│                                                                             │
│  MODULE 4: Building Customer Loyalty                         [🔄] [✏️] [×] │
│  └─ ... (collapsed, click to expand)                                       │
│                                                                             │
│  [+ Add Module]                                                             │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🔄 = Regenerate with AI    ✏️ = Edit manually    × = Delete               │
│                                                                             │
│                        [← Back]  [🔄 Regenerate All]  [Generate Content →] │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## User Actions at This Stage

| Action | What Happens |
|--------|--------------|
| [✏️ Edit] on title | Opens inline editor for title/description |
| [🔄] on module | Regenerates just that module |
| [✏️] on module | Opens module editor modal |
| [×] on module/lesson | Deletes with confirmation |
| [+ Add Lesson] | Adds blank lesson to module |
| [+ Add Module] | Adds blank module |
| [🔄 Regenerate All] | Regenerates entire outline |
| [Generate Content →] | Proceeds to content generation |

---

# STEP 3: Content Generation

## Content Generation Strategy

**Key Innovation: Intelligent Block Selection**

Instead of generating generic text, the AI intelligently chooses from all 48 block types based on:
- Content type (concept vs procedure vs scenario)
- Learning objective
- Variety within the lesson
- Engagement level needed

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  CONTENT TYPE          →    SUGGESTED BLOCKS                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Introduction          →    text, heading, stats                            │
│  Key Concept           →    text, callout, highlight_box                    │
│  List of Items         →    bullet_list, numbered_list, checklist           │
│  Process/Procedure     →    numbered_steps, timeline, process_flow          │
│  Comparison            →    comparison, table, two_column                   │
│  Examples              →    accordion, tabs, scenario                       │
│  Definitions           →    glossary, definition, flashcard                 │
│  Practice              →    knowledge_check, reflection, scenario           │
│  Visual Explanation    →    image, hotspot_image, image_gallery            │
│  Data/Statistics       →    stats, table, comparison                        │
│  Tips/Warnings         →    callout (tip/warning/note/danger)              │
│  Q&A Format            →    accordion, flashcard_deck                       │
│  Interactive Review    →    flashcard_deck, knowledge_check                │
│  Summary               →    highlight_box, bullet_list, callout            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## What User Sees: Generating Content

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Generating Course Content                                      Step 3 of 4 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  Overall Progress:                                                    │ │
│  │  ████████████████████████████░░░░░░░░░░░░░░░░░░░░░░  58%             │ │
│  │                                                                        │ │
│  │  Module 1: First Impressions Matter                                   │ │
│  │  ✓ Lesson 1.1 - The Power of a Warm Greeting                         │ │
│  │  ✓ Lesson 1.2 - Reading Customer Cues                                │ │
│  │  ● Lesson 1.3 - Making Every Customer Feel Welcome...                │ │
│  │  ○ Quiz                                                               │ │
│  │                                                                        │ │
│  │  Module 2: Handling Customer Needs                                    │ │
│  │  ○ Lesson 2.1                                                         │ │
│  │  ○ Lesson 2.2                                                         │ │
│  │  ○ Lesson 2.3                                                         │ │
│  │  ○ Quiz                                                               │ │
│  │                                                                        │ │
│  │  ...                                                                  │ │
│  │                                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Currently generating: Lesson 1.3 content blocks...                        │
│                                                                             │
│  💡 Tip: You can review completed lessons while others are generating.     │
│                                                                             │
│                              [Cancel]  [Review Completed →]                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## AI Prompt: Lesson Content Generation

```typescript
const CONTENT_SYSTEM_PROMPT = `You are an expert instructional designer creating lesson content.

Your content must be:
- Practical and immediately applicable
- Engaging with varied content types
- Appropriate for adult learners
- Broken into digestible chunks (3-7 blocks per lesson)

You have access to these content block types:

TEXT & BASIC: text, heading, quote, divider
LISTS: bullet_list, numbered_list, numbered_steps, checklist
MEDIA: image (describe, don't generate), video_placeholder
INTERACTIVE: accordion, tabs, flashcard, flashcard_deck, reveal
CALLOUTS: callout (types: tip, warning, note, danger, info, success)
DATA: table, comparison, timeline, stats
REFERENCE: glossary, definition
ENGAGEMENT: knowledge_check, scenario, reflection
LAYOUT: two_column, highlight_box

Rules:
1. ALWAYS start with a brief text introduction (2-3 sentences max)
2. NEVER use more than 2 text blocks in a row - break it up
3. Use at least 3 different block types per lesson
4. Include at least 1 interactive element (accordion, flashcard, scenario, etc.)
5. End with either a knowledge_check, reflection, or key takeaway callout
6. Suggest 1-2 image placements with descriptions`;

const CONTENT_USER_PROMPT = `Generate content for this lesson:

COURSE: ${courseTitle}
MODULE: ${moduleTitle}  
LESSON: ${lessonTitle}
SUMMARY: ${lessonSummary}
KEY TOPICS: ${keyTopics.join(', ')}

TARGET AUDIENCE: ${audience}
TONE: ${tone}
ESTIMATED DURATION: ${durationMinutes} minutes

Previous lessons in this module: ${previousLessons.join(', ')}
(Avoid repeating content from previous lessons)

Return a JSON object:
{
  "blocks": [
    {
      "type": "text",
      "content": {
        "text": "Introduction paragraph..."
      }
    },
    {
      "type": "heading",
      "content": {
        "text": "Section Title",
        "level": 2
      }
    },
    {
      "type": "numbered_steps",
      "content": {
        "title": "How to Greet a Customer",
        "steps": [
          {
            "title": "Make Eye Contact",
            "description": "Within 3 seconds of a customer entering..."
          }
        ]
      }
    },
    {
      "type": "callout",
      "content": {
        "type": "tip",
        "title": "Pro Tip",
        "text": "Always smile genuinely..."
      }
    },
    {
      "type": "scenario",
      "content": {
        "title": "Practice Scenario",
        "situation": "A customer walks in looking confused...",
        "question": "What should you do first?",
        "options": [
          {
            "text": "Wait for them to approach you",
            "feedback": "This may make them feel ignored...",
            "is_best": false
          },
          {
            "text": "Greet them warmly and offer help",
            "feedback": "Excellent! This shows you're attentive...",
            "is_best": true
          }
        ]
      }
    }
  ],
  "suggested_images": [
    {
      "placement": "after_block_2",
      "description": "Professional retail employee smiling and making eye contact with customer at store entrance",
      "purpose": "Illustrate proper greeting body language"
    }
  ],
  "key_takeaways": [
    "Greet within 10 seconds",
    "Make eye contact first",
    "Smile genuinely"
  ]
}`;
```

## AI Prompt: Quiz Generation

```typescript
const QUIZ_SYSTEM_PROMPT = `You are creating assessment questions for corporate training.

Question type guidelines:
- multiple_choice: 4 options, 1 correct, include plausible distractors
- true_false: Statement that tests understanding, not trick questions
- multiple_select: 4-5 options, 2-3 correct, clearly state "select all that apply"
- fill_blank: One blank per question, blank shown as _____
- drag_match: Match terms to definitions, 4-6 pairs
- drag_order: Put steps in correct sequence, 4-6 items

Rules:
1. Questions should test understanding, not memorization
2. Include scenario-based questions (40%+)
3. Every question needs an explanation for the correct answer
4. Vary difficulty: 60% moderate, 30% easy, 10% challenging
5. Avoid negative phrasing ("Which is NOT...")`;

const QUIZ_USER_PROMPT = `Create a quiz for this module:

MODULE: ${moduleTitle}
LESSONS COVERED:
${lessons.map(l => `- ${l.title}: ${l.summary}`).join('\n')}

KEY TOPICS: ${keyTopics.join(', ')}
QUESTION COUNT: ${questionCount}

Question type distribution:
- 40% multiple_choice
- 20% true_false  
- 15% scenario (multiple_choice with situation)
- 15% multiple_select
- 10% drag_match or drag_order

Return JSON:
{
  "title": "Module 1 Quiz: First Impressions",
  "description": "Test your knowledge of creating positive first impressions.",
  "passing_score": 70,
  "questions": [
    {
      "type": "multiple_choice",
      "question": "A customer enters the store looking around uncertainly. What should you do first?",
      "options": [
        "Wait to see if they need help",
        "Immediately ask what they're looking for",
        "Make eye contact and offer a warm greeting",
        "Point them to the directory"
      ],
      "correct_answer": 2,
      "explanation": "Making eye contact and greeting warmly shows you're attentive without being pushy. This opens the door for them to ask for help."
    },
    {
      "type": "true_false",
      "question": "You should greet every customer within 10 seconds of them entering your area.",
      "correct_answer": true,
      "explanation": "The 10-second rule ensures customers feel acknowledged quickly, reducing the chance they'll feel ignored."
    },
    {
      "type": "drag_order",
      "question": "Put these greeting steps in the correct order:",
      "items": [
        "Make eye contact",
        "Smile warmly", 
        "Offer verbal greeting",
        "Ask how you can help"
      ],
      "correct_order": [0, 1, 2, 3],
      "explanation": "Eye contact first shows you've noticed them, then smile to appear welcoming, greet verbally, then offer assistance."
    }
  ]
}`;
```

## What User Sees: Content Review

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Review Generated Content                                       Step 3 of 4 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                   │
│  │ COURSE STRUCTURE    │                                                   │
│  │                     │                                                   │
│  │ ▼ Module 1 ✓        │   ┌─────────────────────────────────────────────┐ │
│  │   ├─ Lesson 1.1 ✓   │   │                                             │ │
│  │   ├─ Lesson 1.2 ✓   │   │  LESSON 1.1: The Power of a Warm Greeting   │ │
│  │   ├─ Lesson 1.3 ●   │   │  ═══════════════════════════════════════════ │ │
│  │   └─ Quiz ○         │   │                                             │ │
│  │                     │   │  ┌─────────────────────────────────────────┐│ │
│  │ ▶ Module 2          │   │  │ TEXT BLOCK                     [✏️] [×]││ │
│  │ ▶ Module 3          │   │  │                                         ││ │
│  │ ▶ Module 4          │   │  │ First impressions happen in seconds,   ││ │
│  │                     │   │  │ but their impact lasts. In retail,     ││ │
│  │                     │   │  │ how you greet a customer sets the tone ││ │
│  │                     │   │  │ for their entire experience.           ││ │
│  │ ─────────────────── │   │  │                                         ││ │
│  │                     │   │  └─────────────────────────────────────────┘│ │
│  │ ✓ = Complete        │   │                                             │ │
│  │ ● = Viewing         │   │  ┌─────────────────────────────────────────┐│ │
│  │ ○ = Not started     │   │  │ NUMBERED STEPS              [✏️] [🔄] [×]││ │
│  │                     │   │  │ "The 3-Step Greeting"                   ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ 1. Make Eye Contact                     ││ │
│  │                     │   │  │    Look at the customer within 3        ││ │
│  │                     │   │  │    seconds of them entering your area.  ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ 2. Smile Warmly                         ││ │
│  │                     │   │  │    A genuine smile makes customers      ││ │
│  │                     │   │  │    feel welcome and at ease.            ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ 3. Offer a Verbal Greeting              ││ │
│  │                     │   │  │    "Welcome! Let me know if you need    ││ │
│  │                     │   │  │    any help."                           ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  └─────────────────────────────────────────┘│ │
│  │                     │   │                                             │ │
│  │                     │   │  ┌─────────────────────────────────────────┐│ │
│  │                     │   │  │ 🖼️ IMAGE SUGGESTION          [Generate]││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ "Professional retail employee making   ││ │
│  │                     │   │  │  eye contact with customer at store    ││ │
│  │                     │   │  │  entrance"                              ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ [Generate Image]  [Skip]  [Upload Own] ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  └─────────────────────────────────────────┘│ │
│  │                     │   │                                             │ │
│  │                     │   │  ┌─────────────────────────────────────────┐│ │
│  │                     │   │  │ 💡 CALLOUT (TIP)            [✏️] [🔄] [×]││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ Pro Tip                                 ││ │
│  │                     │   │  │ ─────────────────────────────────────── ││ │
│  │                     │   │  │ If you're helping another customer,    ││ │
│  │                     │   │  │ acknowledge new arrivals with a quick  ││ │
│  │                     │   │  │ "I'll be right with you!" and a smile. ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  └─────────────────────────────────────────┘│ │
│  │                     │   │                                             │ │
│  │                     │   │  ┌─────────────────────────────────────────┐│ │
│  │                     │   │  │ 📋 SCENARIO                 [✏️] [🔄] [×]││ │
│  │                     │   │  │ "The Distracted Customer"               ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ A customer walks in while on their     ││ │
│  │                     │   │  │ phone. They glance around briefly.     ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ What should you do?                     ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  │ ○ Interrupt to greet them              ││ │
│  │                     │   │  │ ○ Wait until they're off the phone     ││ │
│  │                     │   │  │ ● Make eye contact and smile silently  ││ │
│  │                     │   │  │                                         ││ │
│  │                     │   │  └─────────────────────────────────────────┘│ │
│  │                     │   │                                             │ │
│  │                     │   │  ─────────────────────────────────────────  │ │
│  │                     │   │                                             │ │
│  │                     │   │  [+ Add Block]  [🔄 Regenerate Lesson]      │ │
│  │                     │   │                                             │ │
│  └─────────────────────┘   └─────────────────────────────────────────────┘ │
│                                                                             │
│                                    [← Back]  [Continue to Review →]        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## User Actions: Content Review

| Action | What Happens |
|--------|--------------|
| [✏️] on any block | Opens the block-specific editor form |
| [🔄] on any block | Regenerates just that block |
| [×] on any block | Deletes the block |
| [+ Add Block] | Opens block picker to add manually |
| [🔄 Regenerate Lesson] | Regenerates all blocks in lesson |
| [Generate Image] | Calls DALL-E to generate the suggested image |
| [Skip] | Removes the image suggestion |
| [Upload Own] | Opens file upload dialog |
| Drag blocks | Reorder blocks within lesson |

---

# STEP 4: Final Review & Publish

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Review & Publish                                               Step 4 of 4 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CUSTOMER SERVICE EXCELLENCE FOR RETAIL                                     │
│  ═══════════════════════════════════════════════════════════════════════    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  📊 COURSE SUMMARY                                                  │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                      │   │
│  │  Duration         Modules        Lessons        Quizzes              │   │
│  │  ~45 min          4              12             4                    │   │
│  │                                                                      │   │
│  │  Content Blocks   Images         Scenarios      Knowledge Checks     │   │
│  │  67               8              6              8                    │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ✓ COMPLETION CHECKLIST                                             │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                      │   │
│  │  ✓ Course title and description                                     │   │
│  │  ✓ All 4 modules have content                                       │   │
│  │  ✓ All 12 lessons have content blocks                               │   │
│  │  ✓ All 4 quizzes have questions                                     │   │
│  │  ✓ 8 of 8 suggested images generated                                │   │
│  │  ✓ Passing score set (70%)                                          │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  COURSE SETTINGS                                                            │
│                                                                             │
│  Passing Score:  [ 70 ]%                                                   │
│                                                                             │
│  ☑ Award certificate on completion                                         │
│  ☐ Allow learners to skip ahead                                            │
│  ☑ Show progress bar                                                       │
│  ☑ Enable bookmarking                                                      │
│                                                                             │
│  Thumbnail:                                                                 │
│  ┌────────────────┐                                                        │
│  │                │  [Generate from Course]  [Upload Custom]               │
│  │  [Thumbnail]   │                                                        │
│  │                │                                                        │
│  └────────────────┘                                                        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [← Back to Edit]     [Preview Course]     [Save as Draft]     [Publish]   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Image Generation Integration

## When Images Are Suggested

The AI suggests images at strategic points:
- After introducing a new concept
- For steps that benefit from visual demonstration
- For scenarios that set a scene
- For comparison blocks

## Image Generation Prompt

```typescript
const IMAGE_SYSTEM_PROMPT = `Generate professional images for corporate training materials.

Style requirements:
- Modern, clean, professional aesthetic
- Appropriate for workplace/corporate settings
- Diverse representation of people
- Well-lit, high-quality appearance
- No text or logos in the image
- Safe for work environments

Color palette: Clean, neutral backgrounds with accent colors`;

const generateImagePrompt = (suggestion: ImageSuggestion) => {
  return `Create a professional training illustration:

SUBJECT: ${suggestion.description}
PURPOSE: ${suggestion.purpose}
CONTEXT: Corporate ${industry} training material

Style: Modern, professional, clean
Setting: ${industry} workplace environment
People: Professional attire, diverse representation
Mood: Positive, helpful, professional

DO NOT include: Text, logos, brand names, watermarks`;
};
```

## Image Generation UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Generate Image                                                        [×]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AI Suggestion:                                                             │
│  "Professional retail employee making eye contact with customer at store   │
│   entrance"                                                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Customize (optional):                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Professional retail employee smiling and making eye contact with    │   │
│  │ customer at modern store entrance                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Style:                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                      │
│  │   Photo  │ │Illustration│ │ Minimal │ │ Corporate│                      │
│  │    ●     │ │     ○     │ │    ○    │ │    ○     │                      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                      │
│                                                                             │
│  Size:  ● Standard (1024x1024)   ○ Wide (1792x1024)   ○ Tall (1024x1792)  │
│                                                                             │
│  Cost: ~$0.04 per image                                                    │
│                                                                             │
│                                          [Cancel]  [Generate Image]        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

After generation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Image Generated                                                       [×]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │                                                                      │   │
│  │                    [Generated Image Preview]                        │   │
│  │                                                                      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ☑ Happy with this image                                                   │
│                                                                             │
│  [🔄 Regenerate]   [Try Different Style]   [Upload Own Instead]            │
│                                                                             │
│                                              [Cancel]  [Use This Image]    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Technical Implementation

## Database: Generation Tracking

```sql
-- Track AI generation for cost monitoring and regeneration
CREATE TABLE ai_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was generated
  generation_type TEXT NOT NULL CHECK (generation_type IN (
    'course_outline', 'lesson_content', 'quiz', 'image', 'single_block'
  )),
  
  -- Related entities
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  content_block_id UUID REFERENCES content_blocks(id) ON DELETE SET NULL,
  
  -- AI details
  model_used TEXT NOT NULL,  -- 'gpt-4o', 'dall-e-3', etc.
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  
  -- Cost tracking
  estimated_cost DECIMAL(10, 4),
  
  -- Input/Output (for debugging and regeneration)
  input_prompt TEXT,
  output_json JSONB,
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  
  -- Meta
  generated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_gen_course ON ai_generation_log(course_id);
CREATE INDEX idx_ai_gen_type ON ai_generation_log(generation_type);
```

## API Structure

```typescript
// /api/ai/generate-outline
// /api/ai/generate-lesson-content
// /api/ai/generate-quiz
// /api/ai/generate-image
// /api/ai/regenerate-block
```

## Generate Outline Endpoint

```typescript
// app/api/ai/generate-outline/route.ts

import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const supabase = createClient();
  
  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Get request body
  const body = await request.json();
  const {
    topic,
    description,
    audience,
    industry,
    tone,
    moduleCount,
    lessonsPerModule,
    includeQuizzes
  } = body;
  
  // Build prompt
  const systemPrompt = OUTLINE_SYSTEM_PROMPT;
  const userPrompt = buildOutlinePrompt({
    topic,
    description,
    audience,
    industry,
    tone,
    moduleCount,
    lessonsPerModule,
    includeQuizzes
  });
  
  try {
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    
    // Parse response
    const outline = JSON.parse(completion.choices[0].message.content);
    
    // Log generation
    await supabase.from('ai_generation_log').insert({
      generation_type: 'course_outline',
      model_used: 'gpt-4o',
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      estimated_cost: calculateCost(completion.usage),
      input_prompt: userPrompt,
      output_json: outline,
      status: 'completed',
      generated_by: user.id
    });
    
    return Response.json({ success: true, outline });
    
  } catch (error) {
    console.error('Outline generation failed:', error);
    return Response.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
```

## Generate Lesson Content Endpoint

```typescript
// app/api/ai/generate-lesson-content/route.ts

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  const {
    courseTitle,
    moduleTitle,
    lessonTitle,
    lessonSummary,
    keyTopics,
    audience,
    tone,
    durationMinutes,
    previousLessons
  } = body;
  
  const systemPrompt = CONTENT_SYSTEM_PROMPT;
  const userPrompt = buildContentPrompt({
    courseTitle,
    moduleTitle,
    lessonTitle,
    lessonSummary,
    keyTopics,
    audience,
    tone,
    durationMinutes,
    previousLessons
  });
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    
    const content = JSON.parse(completion.choices[0].message.content);
    
    // Validate blocks have correct structure
    const validatedBlocks = validateAndCleanBlocks(content.blocks);
    
    // Log generation
    await supabase.from('ai_generation_log').insert({
      generation_type: 'lesson_content',
      lesson_id: body.lessonId,
      model_used: 'gpt-4o',
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      estimated_cost: calculateCost(completion.usage),
      output_json: content,
      status: 'completed',
      generated_by: user.id
    });
    
    return Response.json({
      success: true,
      blocks: validatedBlocks,
      suggested_images: content.suggested_images,
      key_takeaways: content.key_takeaways
    });
    
  } catch (error) {
    console.error('Content generation failed:', error);
    return Response.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

## Block Validation

```typescript
// lib/ai/validate-blocks.ts

import { ContentBlockType } from '@/types/content-blocks';

const VALID_BLOCK_TYPES: ContentBlockType[] = [
  'text', 'heading', 'quote', 'divider',
  'bullet_list', 'numbered_list', 'numbered_steps', 'checklist',
  'image', 'video', 'audio', 'file_download',
  'accordion', 'tabs', 'flashcard', 'flashcard_deck', 'hotspot_image', 'reveal',
  'table', 'comparison', 'timeline', 'stats',
  'callout', 'highlight_box',
  'glossary', 'definition', 'code',
  'knowledge_check', 'scenario', 'reflection',
  'two_column', 'three_column'
];

export function validateAndCleanBlocks(blocks: any[]): ContentBlock[] {
  return blocks
    .filter(block => {
      // Check if type is valid
      if (!VALID_BLOCK_TYPES.includes(block.type)) {
        console.warn(`Invalid block type: ${block.type}`);
        return false;
      }
      return true;
    })
    .map((block, index) => ({
      id: crypto.randomUUID(),
      type: block.type,
      content: cleanBlockContent(block.type, block.content),
      sort_order: index
    }));
}

function cleanBlockContent(type: ContentBlockType, content: any): any {
  // Ensure content matches expected structure for each block type
  switch (type) {
    case 'text':
      return { text: String(content.text || '') };
      
    case 'heading':
      return {
        text: String(content.text || ''),
        level: [1, 2, 3, 4].includes(content.level) ? content.level : 2
      };
      
    case 'callout':
      return {
        type: ['tip', 'warning', 'note', 'danger', 'info'].includes(content.type) 
          ? content.type : 'info',
        title: content.title || undefined,
        text: String(content.text || '')
      };
      
    case 'numbered_steps':
      return {
        title: content.title || undefined,
        steps: Array.isArray(content.steps) 
          ? content.steps.map((s: any) => ({
              title: String(s.title || ''),
              description: String(s.description || '')
            }))
          : []
      };
      
    case 'scenario':
      return {
        title: String(content.title || ''),
        situation: String(content.situation || ''),
        question: String(content.question || ''),
        options: Array.isArray(content.options)
          ? content.options.map((o: any) => ({
              text: String(o.text || ''),
              feedback: String(o.feedback || ''),
              is_best: Boolean(o.is_best)
            }))
          : []
      };
      
    // ... handle all other block types
      
    default:
      return content;
  }
}
```

---

# Cost Estimation

```typescript
// lib/ai/cost-estimation.ts

const PRICING = {
  'gpt-4o': {
    input: 0.005,   // per 1K tokens
    output: 0.015   // per 1K tokens
  },
  'dall-e-3': {
    '1024x1024': 0.04,
    '1792x1024': 0.08,
    '1024x1792': 0.08
  }
};

export function estimateCourseCost(params: {
  moduleCount: number;
  lessonsPerModule: number;
  includeImages: boolean;
  includeQuizzes: boolean;
}): { text: number; images: number; total: number } {
  const { moduleCount, lessonsPerModule, includeImages, includeQuizzes } = params;
  
  const totalLessons = moduleCount * lessonsPerModule;
  
  // Estimate token usage
  const outlineTokens = 2000;  // One outline generation
  const lessonTokens = 1500 * totalLessons;  // Per lesson
  const quizTokens = includeQuizzes ? 800 * moduleCount : 0;  // Per quiz
  
  const totalInputTokens = (outlineTokens + lessonTokens + quizTokens) * 0.3;  // Prompts
  const totalOutputTokens = outlineTokens + lessonTokens + quizTokens;  // Completions
  
  const textCost = (totalInputTokens / 1000 * PRICING['gpt-4o'].input) +
                   (totalOutputTokens / 1000 * PRICING['gpt-4o'].output);
  
  // Estimate ~2 images per lesson
  const imageCount = includeImages ? totalLessons * 2 : 0;
  const imageCost = imageCount * PRICING['dall-e-3']['1024x1024'];
  
  return {
    text: Math.round(textCost * 100) / 100,
    images: Math.round(imageCost * 100) / 100,
    total: Math.round((textCost + imageCost) * 100) / 100
  };
}
```

---

# Summary: What Makes This Cutting-Edge

| Feature | Implementation |
|---------|----------------|
| **Intelligent Block Selection** | AI chooses from 48 block types based on content |
| **Progressive Generation** | Outline → Content → Images (user approves each step) |
| **Selective Regeneration** | Regenerate any block, lesson, or module independently |
| **Real-time Preview** | See content as it's generated |
| **Cost Transparency** | Show estimated cost before generation |
| **Human in the Loop** | Edit AI output at every step |
| **Image Integration** | AI suggests images, user approves and generates |
| **Variety Enforcement** | AI must use 3+ different block types per lesson |
| **Context Awareness** | AI knows what previous lessons covered |
| **Validation** | All AI output validated before saving |

---

# File Structure

```
apps/web/src/
├── app/
│   ├── super-admin/
│   │   └── courses/
│   │       ├── new/
│   │       │   ├── page.tsx              # Step 1: Setup
│   │       │   ├── outline/page.tsx       # Step 2: Outline review
│   │       │   ├── content/page.tsx       # Step 3: Content review
│   │       │   └── publish/page.tsx       # Step 4: Final review
│   │       └── [id]/
│   │           └── edit/page.tsx          # Edit existing course
│   └── api/
│       └── ai/
│           ├── generate-outline/route.ts
│           ├── generate-lesson-content/route.ts
│           ├── generate-quiz/route.ts
│           ├── generate-image/route.ts
│           └── regenerate-block/route.ts
├── components/
│   └── course-builder/
│       ├── CourseSetupForm.tsx
│       ├── OutlineReview.tsx
│       ├── ContentReview.tsx
│       ├── BlockPreview.tsx
│       ├── ImageGenerator.tsx
│       └── CostEstimate.tsx
└── lib/
    └── ai/
        ├── prompts.ts
        ├── cost-estimation.ts
        ├── validate-blocks.ts
        └── openai-client.ts
```
