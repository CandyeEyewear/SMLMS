# LMS Platform - Content Blocks Reference

## Overview

This document defines all content block types available in the course builder. Each block has a specific purpose, data structure, and visual representation.

---

## Block Categories

| Category | Count | Purpose |
|----------|-------|---------|
| Text & Basic | 4 | Core written content |
| Lists & Steps | 4 | Organized information |
| Media | 6 | Visual and audio content |
| Interactive Learning | 7 | Engaging, clickable content |
| Data & Comparison | 5 | Structured information |
| Callouts & Highlights | 7 | Emphasized content |
| Reference & Knowledge | 5 | Definitions and references |
| Engagement & Practice | 6 | Active learning |
| Layout & Structure | 4 | Content organization |

**Total: 48 Block Types**

---

## Implementation Priority

### Phase 1: Essential (Must Have)
- Text
- Heading
- Bullet List
- Numbered Steps
- Image
- Video
- Callout (all types)
- Accordion
- Quote

### Phase 2: Important (Should Have)
- Numbered List
- Checklist
- Table
- Flashcard
- Tabs
- Glossary
- Hotspot Image
- Divider
- Highlight Box

### Phase 3: Enhanced (Nice to Have)
- Timeline
- Comparison
- Code Block
- Knowledge Check
- Two/Three Column
- File Download
- Audio
- Card Grid
- All remaining blocks

---

## Category 1: Text & Basic Content

### 1.1 Text Block

**Purpose:** Main paragraphs of content with rich text formatting.

**When to Use:** Explanations, descriptions, introductions.

```typescript
interface TextBlockContent {
  text: string;  // Supports markdown: **bold**, *italic*, [links](url)
}
```

**Example Content:**
```json
{
  "text": "Customer service is the **foundation** of any successful business. When customers feel *valued* and *heard*, they become loyal advocates for your brand.\n\nIn this lesson, we'll explore the key principles that drive exceptional customer experiences."
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Customer service is the foundation of any successful      │
│  business. When customers feel valued and heard, they      │
│  become loyal advocates for your brand.                    │
│                                                             │
│  In this lesson, we'll explore the key principles that     │
│  drive exceptional customer experiences.                   │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.2 Heading Block

**Purpose:** Section titles within a lesson to break up content.

**When to Use:** Introducing new sections, creating visual hierarchy.

```typescript
interface HeadingBlockContent {
  text: string;
  level: 1 | 2 | 3 | 4;  // h1, h2, h3, h4
}
```

**Example Content:**
```json
{
  "text": "Understanding Customer Needs",
  "level": 2
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Understanding Customer Needs                               │
│  ═══════════════════════════════                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.3 Quote Block

**Purpose:** Highlighted quotation with optional attribution.

**When to Use:** Expert opinions, famous sayings, customer testimonials.

```typescript
interface QuoteBlockContent {
  text: string;
  author?: string;
  source?: string;
  style?: 'default' | 'large' | 'centered';
}
```

**Example Content:**
```json
{
  "text": "The customer's perception is your reality.",
  "author": "Kate Zabriskie",
  "source": "Customer Service Expert",
  "style": "large"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     "The customer's perception is your reality."           │
│                                                             │
│                              — Kate Zabriskie               │
│                                Customer Service Expert      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.4 Divider Block

**Purpose:** Visual separator between content sections.

**When to Use:** Creating visual breaks, transitioning between topics.

```typescript
interface DividerBlockContent {
  style: 'line' | 'dots' | 'space';
  spacing: 'small' | 'medium' | 'large';
}
```

**Example Content:**
```json
{
  "style": "line",
  "spacing": "medium"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Category 2: Lists & Steps

### 2.1 Bullet List Block

**Purpose:** Unordered list of key points.

**When to Use:** Features, tips, key takeaways, non-sequential items.

```typescript
interface BulletListBlockContent {
  title?: string;
  items: string[];
  style?: 'disc' | 'circle' | 'square' | 'check' | 'arrow';
}
```

**Example Content:**
```json
{
  "title": "Key Customer Expectations",
  "items": [
    "Quick response times",
    "Knowledgeable staff",
    "Friendly, professional attitude",
    "Solutions to their problems"
  ],
  "style": "disc"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Key Customer Expectations                                  │
│                                                             │
│  • Quick response times                                     │
│  • Knowledgeable staff                                      │
│  • Friendly, professional attitude                          │
│  • Solutions to their problems                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Numbered List Block

**Purpose:** Ordered list for sequential information.

**When to Use:** Rankings, priorities, sequences.

```typescript
interface NumberedListBlockContent {
  title?: string;
  items: string[];
  start?: number;  // Starting number (default 1)
}
```

**Example Content:**
```json
{
  "title": "Top 5 Customer Service Skills",
  "items": [
    "Active Listening",
    "Empathy",
    "Clear Communication",
    "Problem Solving",
    "Patience"
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Top 5 Customer Service Skills                              │
│                                                             │
│  1. Active Listening                                        │
│  2. Empathy                                                 │
│  3. Clear Communication                                     │
│  4. Problem Solving                                         │
│  5. Patience                                                │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.3 Numbered Steps Block

**Purpose:** Step-by-step instructions with titles and descriptions.

**When to Use:** How-to guides, procedures, processes.

```typescript
interface NumberedStepsBlockContent {
  title?: string;
  steps: {
    title: string;
    description: string;
    image_url?: string;
  }[];
}
```

**Example Content:**
```json
{
  "title": "How to Handle a Customer Complaint",
  "steps": [
    {
      "title": "Listen Actively",
      "description": "Let the customer explain their issue without interruption. Show you're engaged with nods and brief acknowledgments."
    },
    {
      "title": "Acknowledge the Problem",
      "description": "Validate their feelings by saying something like 'I understand how frustrating this must be for you.'"
    },
    {
      "title": "Offer a Solution",
      "description": "Present options to resolve the issue. Give the customer choices when possible."
    }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  How to Handle a Customer Complaint                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1   Listen Actively                                │   │
│  │      Let the customer explain their issue without   │   │
│  │      interruption. Show you're engaged with nods    │   │
│  │      and brief acknowledgments.                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  2   Acknowledge the Problem                        │   │
│  │      Validate their feelings by saying something    │   │
│  │      like "I understand how frustrating this must   │   │
│  │      be for you."                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  3   Offer a Solution                               │   │
│  │      Present options to resolve the issue. Give     │   │
│  │      the customer choices when possible.            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Checklist Block

**Purpose:** Interactive checkbox list for action items.

**When to Use:** To-do lists, action items, requirements.

```typescript
interface ChecklistBlockContent {
  title?: string;
  items: {
    text: string;
    checked: boolean;
  }[];
  allow_interaction: boolean;  // Can learner check items?
}
```

**Example Content:**
```json
{
  "title": "Before Your Shift Checklist",
  "items": [
    { "text": "Review today's promotions", "checked": false },
    { "text": "Check inventory levels", "checked": false },
    { "text": "Clean and organize workspace", "checked": false },
    { "text": "Log into POS system", "checked": false },
    { "text": "Review customer feedback from yesterday", "checked": false }
  ],
  "allow_interaction": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Before Your Shift Checklist                                │
│                                                             │
│  ☐ Review today's promotions                               │
│  ☐ Check inventory levels                                  │
│  ☐ Clean and organize workspace                            │
│  ☐ Log into POS system                                     │
│  ☐ Review customer feedback from yesterday                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Category 3: Media

### 3.1 Image Block

**Purpose:** Single image with optional caption.

**When to Use:** Diagrams, photos, illustrations, screenshots.

```typescript
interface ImageBlockContent {
  url: string;
  alt: string;
  caption?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  alignment: 'left' | 'center' | 'right';
}
```

**Example Content:**
```json
{
  "url": "https://storage.example.com/images/customer-journey.png",
  "alt": "Customer journey diagram showing 5 stages",
  "caption": "Figure 1: The Customer Journey from Awareness to Advocacy",
  "size": "large",
  "alignment": "center"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                                                      │   │
│  │               [IMAGE PLACEHOLDER]                    │   │
│  │                                                      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│   Figure 1: The Customer Journey from Awareness to Advocacy │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Image Gallery Block

**Purpose:** Multiple images in a grid or carousel.

**When to Use:** Before/after comparisons, multiple examples, portfolios.

```typescript
interface ImageGalleryBlockContent {
  title?: string;
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  layout: 'grid' | 'carousel' | 'masonry';
  columns: 2 | 3 | 4;
}
```

**Example Content:**
```json
{
  "title": "Store Layout Examples",
  "images": [
    { "url": "https://...", "alt": "Layout A", "caption": "Open floor plan" },
    { "url": "https://...", "alt": "Layout B", "caption": "Boutique style" },
    { "url": "https://...", "alt": "Layout C", "caption": "Department zones" }
  ],
  "layout": "grid",
  "columns": 3
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Store Layout Examples                                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │             │  │             │  │             │         │
│  │  [Image 1]  │  │  [Image 2]  │  │  [Image 3]  │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│   Open floor plan  Boutique style   Department zones       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Video Block

**Purpose:** Embedded video content.

**When to Use:** Demonstrations, lectures, tutorials, testimonials.

```typescript
interface VideoBlockContent {
  url: string;  // YouTube, Vimeo, or direct upload URL
  title: string;
  duration_seconds: number;
  thumbnail_url?: string;
  auto_play?: boolean;
  show_controls?: boolean;
}
```

**Example Content:**
```json
{
  "url": "https://youtube.com/watch?v=abc123",
  "title": "Introduction to Customer Service",
  "duration_seconds": 180,
  "thumbnail_url": "https://...",
  "auto_play": false,
  "show_controls": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Introduction to Customer Service                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                        ▶                            │   │
│  │                                                      │   │
│  │  ▐█████████████████████░░░░░░░░░░░░░▌  1:23 / 3:00  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.4 Audio Block

**Purpose:** Audio player for spoken content.

**When to Use:** Podcasts, pronunciations, music, narration.

```typescript
interface AudioBlockContent {
  url: string;
  title: string;
  duration_seconds: number;
  show_transcript?: boolean;
  transcript?: string;
}
```

**Example Content:**
```json
{
  "url": "https://storage.example.com/audio/interview.mp3",
  "title": "Interview with Customer Service Manager",
  "duration_seconds": 420,
  "show_transcript": true,
  "transcript": "Welcome to today's episode..."
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  🎧 Interview with Customer Service Manager                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▶  ▐█████████░░░░░░░░░░░░░░░░░░░░▌  2:15 / 7:00   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📝 View Transcript                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.5 File Download Block

**Purpose:** Downloadable file attachment.

**When to Use:** Worksheets, templates, PDFs, resources.

```typescript
interface FileDownloadBlockContent {
  url: string;
  filename: string;
  file_type: 'pdf' | 'doc' | 'xls' | 'ppt' | 'zip' | 'other';
  file_size_bytes: number;
  description?: string;
}
```

**Example Content:**
```json
{
  "url": "https://storage.example.com/files/worksheet.pdf",
  "filename": "Customer Service Worksheet.pdf",
  "file_type": "pdf",
  "file_size_bytes": 245000,
  "description": "Complete this worksheet to practice handling difficult customers."
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📄 Customer Service Worksheet.pdf                  │   │
│  │                                                      │   │
│  │  Complete this worksheet to practice handling       │   │
│  │  difficult customers.                               │   │
│  │                                                      │   │
│  │  PDF • 245 KB                    [Download]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.6 Embed Block

**Purpose:** External embedded content via iframe.

**When to Use:** Interactive tools, maps, third-party widgets.

```typescript
interface EmbedBlockContent {
  url: string;
  title: string;
  height: number;  // pixels
  type: 'iframe' | 'twitter' | 'linkedin' | 'google_form' | 'typeform';
}
```

**Example Content:**
```json
{
  "url": "https://forms.google.com/...",
  "title": "Customer Satisfaction Survey",
  "height": 400,
  "type": "google_form"
}
```

---

## Category 4: Interactive Learning

### 4.1 Accordion Block

**Purpose:** Expandable/collapsible content sections.

**When to Use:** FAQs, detailed breakdowns, optional deep-dives.

```typescript
interface AccordionBlockContent {
  title?: string;
  items: {
    title: string;
    content: string;  // Supports markdown
    default_open?: boolean;
  }[];
  allow_multiple_open: boolean;
}
```

**Example Content:**
```json
{
  "title": "Frequently Asked Questions",
  "items": [
    {
      "title": "What is customer service?",
      "content": "Customer service is the support and assistance provided to customers before, during, and after a purchase. It encompasses all interactions that affect a customer's perception of your business.",
      "default_open": true
    },
    {
      "title": "Why is customer service important?",
      "content": "Good customer service builds loyalty, increases revenue, and creates brand advocates. Studies show that 86% of customers are willing to pay more for a better experience."
    },
    {
      "title": "How can I improve my customer service skills?",
      "content": "Focus on active listening, empathy, clear communication, and problem-solving. Practice these skills daily and seek feedback from customers and colleagues."
    }
  ],
  "allow_multiple_open": false
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Frequently Asked Questions                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▼ What is customer service?                        │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Customer service is the support and assistance     │   │
│  │  provided to customers before, during, and after    │   │
│  │  a purchase. It encompasses all interactions that   │   │
│  │  affect a customer's perception of your business.   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▶ Why is customer service important?               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ▶ How can I improve my customer service skills?    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Tabs Block

**Purpose:** Tabbed content panels for organized information.

**When to Use:** Comparing options, categories, different perspectives.

```typescript
interface TabsBlockContent {
  tabs: {
    label: string;
    icon?: string;
    content: string;  // Supports markdown
  }[];
  default_tab?: number;  // Index of default open tab
}
```

**Example Content:**
```json
{
  "tabs": [
    {
      "label": "In Person",
      "content": "When serving customers face-to-face:\n\n• Make eye contact\n• Smile genuinely\n• Use open body language\n• Give full attention"
    },
    {
      "label": "On Phone",
      "content": "When serving customers by phone:\n\n• Answer within 3 rings\n• Speak clearly and warmly\n• Use the customer's name\n• Summarize and confirm"
    },
    {
      "label": "Online",
      "content": "When serving customers online:\n\n• Respond within 24 hours\n• Use professional language\n• Be concise but thorough\n• Include helpful links"
    }
  ],
  "default_tab": 0
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────┬────────────┬────────────┐                  │
│  │ In Person  │  On Phone  │   Online   │                  │
│  └────────────┴────────────┴────────────┘                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  When serving customers face-to-face:               │   │
│  │                                                      │   │
│  │  • Make eye contact                                 │   │
│  │  • Smile genuinely                                  │   │
│  │  • Use open body language                           │   │
│  │  • Give full attention                              │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Flashcard Block

**Purpose:** Single flip card for memorization.

**When to Use:** Definitions, Q&A, vocabulary.

```typescript
interface FlashcardBlockContent {
  front: {
    text: string;
    image_url?: string;
  };
  back: {
    text: string;
    image_url?: string;
  };
}
```

**Example Content:**
```json
{
  "front": {
    "text": "What does CRM stand for?"
  },
  "back": {
    "text": "Customer Relationship Management\n\nA system for managing a company's interactions with current and potential customers."
  }
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                                                      │   │
│  │           What does CRM stand for?                  │   │
│  │                                                      │   │
│  │                                                      │   │
│  │                  [Click to flip]                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.4 Flashcard Deck Block

**Purpose:** Multiple flip cards in a deck.

**When to Use:** Vocabulary sets, term memorization, study aids.

```typescript
interface FlashcardDeckBlockContent {
  title?: string;
  cards: {
    front: string;
    back: string;
  }[];
  shuffle?: boolean;
  show_progress?: boolean;
}
```

**Example Content:**
```json
{
  "title": "Customer Service Vocabulary",
  "cards": [
    { "front": "Empathy", "back": "The ability to understand and share the feelings of another." },
    { "front": "De-escalation", "back": "Techniques used to calm an upset customer." },
    { "front": "Upselling", "back": "Encouraging a customer to purchase a higher-end product." },
    { "front": "Churn", "back": "The rate at which customers stop doing business with you." }
  ],
  "shuffle": true,
  "show_progress": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Customer Service Vocabulary                   Card 1 of 4 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │                     Empathy                          │   │
│  │                                                      │   │
│  │                  [Click to flip]                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                    [←]  [→]  [Shuffle]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.5 Hotspot Image Block

**Purpose:** Image with clickable areas that reveal information.

**When to Use:** Labeled diagrams, exploring images, interactive maps.

```typescript
interface HotspotImageBlockContent {
  image_url: string;
  image_alt: string;
  hotspots: {
    id: string;
    x: number;  // Percentage from left
    y: number;  // Percentage from top
    title: string;
    description: string;
    image_url?: string;
  }[];
}
```

**Example Content:**
```json
{
  "image_url": "https://storage.example.com/images/store-layout.png",
  "image_alt": "Store floor plan with marked areas",
  "hotspots": [
    {
      "id": "1",
      "x": 25,
      "y": 30,
      "title": "Checkout Counter",
      "description": "This is where customers complete their purchase. Keep this area clean and organized."
    },
    {
      "id": "2",
      "x": 75,
      "y": 50,
      "title": "Product Display",
      "description": "Featured products are displayed here. Rotate items weekly to keep the display fresh."
    }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │        ●                                            │   │
│  │     Checkout                                        │   │
│  │                                                      │   │
│  │                                 ●                   │   │
│  │                              Product                │   │
│  │                              Display                │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Click on the markers to learn more about each area.       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.6 Slider/Carousel Block

**Purpose:** Swipeable content panels.

**When to Use:** Step-through content, image galleries, testimonials.

```typescript
interface SliderBlockContent {
  title?: string;
  slides: {
    title?: string;
    content: string;
    image_url?: string;
  }[];
  auto_play?: boolean;
  show_dots?: boolean;
  show_arrows?: boolean;
}
```

**Example Content:**
```json
{
  "title": "Customer Testimonials",
  "slides": [
    {
      "content": "\"The staff was incredibly helpful and went above and beyond to solve my issue.\"",
      "title": "— Sarah M., Regular Customer"
    },
    {
      "content": "\"Best customer service experience I've ever had. Will definitely return!\"",
      "title": "— John D., New Customer"
    }
  ],
  "auto_play": true,
  "show_dots": true,
  "show_arrows": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Customer Testimonials                                      │
│                                                             │
│       ┌─────────────────────────────────────────────┐      │
│   ◀   │                                             │   ▶  │
│       │  "The staff was incredibly helpful and      │      │
│       │   went above and beyond to solve my issue." │      │
│       │                                             │      │
│       │              — Sarah M., Regular Customer   │      │
│       │                                             │      │
│       └─────────────────────────────────────────────┘      │
│                                                             │
│                          ● ○ ○                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.7 Reveal Block

**Purpose:** Hidden content shown on click.

**When to Use:** Answers, spoilers, hints, progressive disclosure.

```typescript
interface RevealBlockContent {
  prompt: string;
  hidden_content: string;
  button_text?: string;  // Default: "Reveal Answer"
  style: 'button' | 'blur' | 'flip';
}
```

**Example Content:**
```json
{
  "prompt": "What should you say when a customer is upset about a delayed order?",
  "hidden_content": "\"I completely understand your frustration. Let me look into this right away and find a solution for you.\"",
  "button_text": "Show Example Response",
  "style": "button"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  What should you say when a customer is upset about a      │
│  delayed order?                                             │
│                                                             │
│                  [Show Example Response]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Category 5: Data & Comparison

### 5.1 Table Block

**Purpose:** Data in rows and columns.

**When to Use:** Comparisons, schedules, data, specifications.

```typescript
interface TableBlockContent {
  title?: string;
  headers: string[];
  rows: string[][];
  striped?: boolean;
  highlight_first_column?: boolean;
}
```

**Example Content:**
```json
{
  "title": "Support Channel Response Times",
  "headers": ["Channel", "First Response", "Resolution Time"],
  "rows": [
    ["Phone", "< 1 minute", "5-10 minutes"],
    ["Email", "< 4 hours", "24-48 hours"],
    ["Live Chat", "< 30 seconds", "10-15 minutes"],
    ["Social Media", "< 1 hour", "2-4 hours"]
  ],
  "striped": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Support Channel Response Times                             │
│                                                             │
│  ┌──────────────┬─────────────────┬─────────────────┐      │
│  │ Channel      │ First Response  │ Resolution Time │      │
│  ├──────────────┼─────────────────┼─────────────────┤      │
│  │ Phone        │ < 1 minute      │ 5-10 minutes    │      │
│  │ Email        │ < 4 hours       │ 24-48 hours     │      │
│  │ Live Chat    │ < 30 seconds    │ 10-15 minutes   │      │
│  │ Social Media │ < 1 hour        │ 2-4 hours       │      │
│  └──────────────┴─────────────────┴─────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.2 Comparison Block

**Purpose:** Side-by-side comparison of options.

**When to Use:** Pros/cons, options, features comparison.

```typescript
interface ComparisonBlockContent {
  title?: string;
  columns: {
    header: string;
    highlight?: boolean;
    items: {
      text: string;
      type: 'pro' | 'con' | 'neutral';
    }[];
  }[];
}
```

**Example Content:**
```json
{
  "title": "Phone vs Email Support",
  "columns": [
    {
      "header": "Phone Support",
      "items": [
        { "text": "Immediate response", "type": "pro" },
        { "text": "Personal connection", "type": "pro" },
        { "text": "Harder to document", "type": "con" },
        { "text": "Limited to business hours", "type": "con" }
      ]
    },
    {
      "header": "Email Support",
      "items": [
        { "text": "Written record", "type": "pro" },
        { "text": "24/7 availability", "type": "pro" },
        { "text": "Delayed response", "type": "con" },
        { "text": "Less personal", "type": "con" }
      ]
    }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Phone vs Email Support                                     │
│                                                             │
│  ┌────────────────────────┬────────────────────────┐       │
│  │     Phone Support      │     Email Support      │       │
│  ├────────────────────────┼────────────────────────┤       │
│  │ ✓ Immediate response   │ ✓ Written record       │       │
│  │ ✓ Personal connection  │ ✓ 24/7 availability    │       │
│  │ ✗ Harder to document   │ ✗ Delayed response     │       │
│  │ ✗ Limited hours        │ ✗ Less personal        │       │
│  └────────────────────────┴────────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.3 Timeline Block

**Purpose:** Chronological events or process steps.

**When to Use:** History, project phases, processes.

```typescript
interface TimelineBlockContent {
  title?: string;
  events: {
    date: string;
    title: string;
    description: string;
    icon?: string;
    image_url?: string;
  }[];
  orientation: 'vertical' | 'horizontal';
}
```

**Example Content:**
```json
{
  "title": "The Evolution of Customer Service",
  "events": [
    {
      "date": "1960s",
      "title": "Call Centers Emerge",
      "description": "Companies begin using dedicated phone lines for customer support."
    },
    {
      "date": "1990s",
      "title": "Email Support",
      "description": "Email becomes a standard customer service channel."
    },
    {
      "date": "2000s",
      "title": "Live Chat",
      "description": "Real-time online chat support becomes popular."
    },
    {
      "date": "2020s",
      "title": "AI & Automation",
      "description": "Chatbots and AI transform customer interactions."
    }
  ],
  "orientation": "vertical"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  The Evolution of Customer Service                          │
│                                                             │
│  ●──── 1960s                                                │
│  │     Call Centers Emerge                                  │
│  │     Companies begin using dedicated phone lines for      │
│  │     customer support.                                    │
│  │                                                          │
│  ●──── 1990s                                                │
│  │     Email Support                                        │
│  │     Email becomes a standard customer service channel.   │
│  │                                                          │
│  ●──── 2000s                                                │
│  │     Live Chat                                            │
│  │     Real-time online chat support becomes popular.       │
│  │                                                          │
│  ●──── 2020s                                                │
│        AI & Automation                                      │
│        Chatbots and AI transform customer interactions.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.4 Process Flow Block

**Purpose:** Visual diagram of a workflow or decision tree.

**When to Use:** Procedures, decision making, workflows.

```typescript
interface ProcessFlowBlockContent {
  title?: string;
  steps: {
    id: string;
    label: string;
    type: 'start' | 'process' | 'decision' | 'end';
    next?: string[];  // IDs of next steps
  }[];
}
```

**Example Content:**
```json
{
  "title": "Complaint Handling Process",
  "steps": [
    { "id": "1", "label": "Receive Complaint", "type": "start", "next": ["2"] },
    { "id": "2", "label": "Listen & Document", "type": "process", "next": ["3"] },
    { "id": "3", "label": "Can Resolve Immediately?", "type": "decision", "next": ["4", "5"] },
    { "id": "4", "label": "Resolve Issue", "type": "process", "next": ["6"] },
    { "id": "5", "label": "Escalate to Manager", "type": "process", "next": ["6"] },
    { "id": "6", "label": "Follow Up", "type": "end" }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Complaint Handling Process                                 │
│                                                             │
│            ┌─────────────────────┐                         │
│            │  Receive Complaint  │                         │
│            └──────────┬──────────┘                         │
│                       ▼                                     │
│            ┌─────────────────────┐                         │
│            │  Listen & Document  │                         │
│            └──────────┬──────────┘                         │
│                       ▼                                     │
│               ◇─────────────◇                              │
│              ╱ Can Resolve  ╲                              │
│             ╱  Immediately?  ╲                             │
│             ╲               ╱                              │
│              ╲─────────────╱                               │
│           Yes │         │ No                               │
│               ▼         ▼                                   │
│       ┌──────────┐ ┌────────────┐                         │
│       │ Resolve  │ │ Escalate to│                         │
│       │  Issue   │ │  Manager   │                         │
│       └────┬─────┘ └─────┬──────┘                         │
│            │             │                                 │
│            └──────┬──────┘                                 │
│                   ▼                                         │
│            ┌─────────────────────┐                         │
│            │     Follow Up       │                         │
│            └─────────────────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 5.5 Stats/Counter Block

**Purpose:** Display key statistics with emphasis.

**When to Use:** Key metrics, highlights, impact numbers.

```typescript
interface StatsBlockContent {
  stats: {
    value: string;
    label: string;
    prefix?: string;  // e.g., "$"
    suffix?: string;  // e.g., "%"
    icon?: string;
  }[];
  layout: 'row' | 'grid';
}
```

**Example Content:**
```json
{
  "stats": [
    { "value": "86", "suffix": "%", "label": "of customers pay more for better service" },
    { "value": "3.5", "suffix": "x", "label": "more likely to recommend after good experience" },
    { "value": "67", "suffix": "%", "label": "of churn is preventable" }
  ],
  "layout": "row"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │                 │ │                 │ │               │ │
│  │      86%        │ │      3.5x       │ │     67%       │ │
│  │                 │ │                 │ │               │ │
│  │ of customers    │ │ more likely to  │ │ of churn is   │ │
│  │ pay more for    │ │ recommend after │ │ preventable   │ │
│  │ better service  │ │ good experience │ │               │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Category 6: Callouts & Highlights

### 6.1-6.6 Callout Blocks

**Purpose:** Emphasized content boxes with different semantic meanings.

**Types:**
- Tip (💡) - Helpful advice
- Warning (⚠️) - Caution needed
- Note (📝) - Additional information  
- Danger (🚫) - Critical warning
- Info (ℹ️) - General information
- Success (✅) - Correct example

```typescript
interface CalloutBlockContent {
  type: 'tip' | 'warning' | 'note' | 'danger' | 'info' | 'success';
  title?: string;
  text: string;
}
```

**Example Content:**
```json
{
  "type": "tip",
  "title": "Pro Tip",
  "text": "Always use the customer's name at least once during the conversation. It creates a personal connection and shows you're paying attention."
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💡 Pro Tip                                         │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Always use the customer's name at least once       │   │
│  │  during the conversation. It creates a personal     │   │
│  │  connection and shows you're paying attention.      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ Warning                                         │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Never argue with a customer, even if you know      │   │
│  │  they are wrong. Focus on finding a solution.       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🚫 Danger                                          │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Never share customer personal information with     │   │
│  │  unauthorized parties. This violates privacy laws.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 6.7 Highlight Box Block

**Purpose:** Colored background box for key takeaways.

**When to Use:** Summaries, key points, important quotes.

```typescript
interface HighlightBoxBlockContent {
  title?: string;
  text: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  icon?: string;
}
```

**Example Content:**
```json
{
  "title": "Key Takeaway",
  "text": "Customer satisfaction is not just about solving problems—it's about how you make customers feel during the process.",
  "color": "blue"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ╔═════════════════════════════════════════════════════╗   │
│  ║  📌 Key Takeaway                                    ║   │
│  ║                                                      ║   │
│  ║  Customer satisfaction is not just about solving    ║   │
│  ║  problems—it's about how you make customers feel    ║   │
│  ║  during the process.                                ║   │
│  ╚═════════════════════════════════════════════════════╝   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Category 7: Reference & Knowledge

### 7.1 Glossary Block

**Purpose:** List of terms with definitions.

**When to Use:** Technical terms, vocabulary, jargon.

```typescript
interface GlossaryBlockContent {
  title?: string;
  terms: {
    term: string;
    definition: string;
  }[];
  searchable?: boolean;
  alphabetized?: boolean;
}
```

**Example Content:**
```json
{
  "title": "Customer Service Glossary",
  "terms": [
    { "term": "Churn Rate", "definition": "The percentage of customers who stop using your service over a given period." },
    { "term": "CSAT", "definition": "Customer Satisfaction Score - a metric measuring customer happiness." },
    { "term": "NPS", "definition": "Net Promoter Score - measures customer loyalty and likelihood to recommend." },
    { "term": "FCR", "definition": "First Contact Resolution - resolving issues on the first interaction." }
  ],
  "searchable": true,
  "alphabetized": true
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  Customer Service Glossary                                  │
│                                                             │
│  🔍 [Search terms...]                                       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Churn Rate                                                 │
│  The percentage of customers who stop using your service    │
│  over a given period.                                       │
│                                                             │
│  CSAT                                                       │
│  Customer Satisfaction Score - a metric measuring customer  │
│  happiness.                                                 │
│                                                             │
│  FCR                                                        │
│  First Contact Resolution - resolving issues on the first   │
│  interaction.                                               │
│                                                             │
│  NPS                                                        │
│  Net Promoter Score - measures customer loyalty and         │
│  likelihood to recommend.                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.2 Definition Block

**Purpose:** Single term with definition (inline).

**When to Use:** Introducing a new concept in context.

```typescript
interface DefinitionBlockContent {
  term: string;
  definition: string;
  pronunciation?: string;
}
```

**Example Content:**
```json
{
  "term": "Empathy",
  "definition": "The ability to understand and share the feelings of another person.",
  "pronunciation": "/ˈempəTHē/"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Empathy  /ˈempəTHē/                                │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  The ability to understand and share the feelings   │   │
│  │  of another person.                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.3 Code Block

**Purpose:** Syntax-highlighted code snippet.

**When to Use:** Programming courses, technical documentation.

```typescript
interface CodeBlockContent {
  language: string;  // javascript, python, html, css, etc.
  code: string;
  filename?: string;
  show_line_numbers?: boolean;
  highlight_lines?: number[];
}
```

**Example Content:**
```json
{
  "language": "javascript",
  "code": "function greetCustomer(name) {\n  return `Hello, ${name}! How can I help you today?`;\n}\n\nconst greeting = greetCustomer('Sarah');\nconsole.log(greeting);",
  "filename": "greeting.js",
  "show_line_numbers": true,
  "highlight_lines": [2]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  greeting.js                                        [Copy]  │
│  ─────────────────────────────────────────────────────────  │
│  1 │ function greetCustomer(name) {                        │
│  2 │   return `Hello, ${name}! How can I help you today?`; │ ◀
│  3 │ }                                                      │
│  4 │                                                        │
│  5 │ const greeting = greetCustomer('Sarah');              │
│  6 │ console.log(greeting);                                │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.4 Formula Block

**Purpose:** Mathematical formulas (LaTeX).

**When to Use:** Math, science, financial courses.

```typescript
interface FormulaBlockContent {
  latex: string;
  caption?: string;
}
```

**Example Content:**
```json
{
  "latex": "CSAT = \\frac{\\text{Satisfied Customers}}{\\text{Total Responses}} \\times 100",
  "caption": "Customer Satisfaction Score Formula"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Satisfied Customers                      │
│          CSAT = ─────────────────────── × 100              │
│                     Total Responses                         │
│                                                             │
│          Customer Satisfaction Score Formula                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.5 Citation Block

**Purpose:** Source reference for academic content.

**When to Use:** Research, academic content, statistics.

```typescript
interface CitationBlockContent {
  text: string;
  source: {
    author: string;
    title: string;
    year: number;
    url?: string;
  };
}
```

**Example Content:**
```json
{
  "text": "86% of buyers are willing to pay more for a great customer experience.",
  "source": {
    "author": "PwC",
    "title": "Future of Customer Experience Survey",
    "year": 2023,
    "url": "https://pwc.com/..."
  }
}
```

---

## Category 8: Engagement & Practice

### 8.1 Knowledge Check Block

**Purpose:** Quick inline question (not graded).

**When to Use:** Check understanding mid-lesson.

```typescript
interface KnowledgeCheckBlockContent {
  question: string;
  type: 'multiple_choice' | 'true_false';
  options?: string[];
  correct_answer: string | number;
  explanation: string;
}
```

**Example Content:**
```json
{
  "question": "What is the first step in handling a customer complaint?",
  "type": "multiple_choice",
  "options": [
    "Offer a discount",
    "Listen actively",
    "Explain company policy",
    "Transfer to a manager"
  ],
  "correct_answer": 1,
  "explanation": "Listening actively shows the customer you care about their issue. Always listen first before offering solutions."
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Quick Check                                              │
│                                                             │
│  What is the first step in handling a customer complaint?  │
│                                                             │
│  ○ Offer a discount                                        │
│  ● Listen actively                                         │
│  ○ Explain company policy                                  │
│  ○ Transfer to a manager                                   │
│                                                             │
│                                         [Check Answer]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.2 Reflection Block

**Purpose:** Prompt for learner to think and optionally write.

**When to Use:** Self-assessment, journaling, applying concepts.

```typescript
interface ReflectionBlockContent {
  prompt: string;
  allow_response: boolean;
  response_placeholder?: string;
  min_words?: number;
}
```

**Example Content:**
```json
{
  "prompt": "Think about a time when you received excellent customer service. What made it memorable? What can you apply from that experience to your own work?",
  "allow_response": true,
  "response_placeholder": "Write your reflection here...",
  "min_words": 50
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  💭 Reflection                                              │
│                                                             │
│  Think about a time when you received excellent customer   │
│  service. What made it memorable? What can you apply from  │
│  that experience to your own work?                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Write your reflection here...                       │   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                              [Save]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.3 Poll Block

**Purpose:** Quick vote or opinion gathering.

**When to Use:** Engagement, opinions, preferences.

```typescript
interface PollBlockContent {
  question: string;
  options: string[];
  show_results: boolean;
  allow_multiple: boolean;
}
```

**Example Content:**
```json
{
  "question": "Which customer service channel do you find most challenging?",
  "options": ["Phone", "Email", "Live Chat", "In Person", "Social Media"],
  "show_results": true,
  "allow_multiple": false
}
```

---

### 8.4 Discussion Prompt Block

**Purpose:** Question to spark discussion or comments.

**When to Use:** Group learning, forums, collaborative courses.

```typescript
interface DiscussionPromptBlockContent {
  prompt: string;
  allow_comments: boolean;
  require_response: boolean;
}
```

**Example Content:**
```json
{
  "prompt": "Share a challenging customer interaction you've had. How did you handle it, and what would you do differently now?",
  "allow_comments": true,
  "require_response": false
}
```

---

### 8.5 Scenario Block

**Purpose:** Situation-based learning with decision points.

**When to Use:** Case studies, role-playing, what-would-you-do.

```typescript
interface ScenarioBlockContent {
  title: string;
  situation: string;
  image_url?: string;
  question: string;
  options: {
    text: string;
    feedback: string;
    is_best: boolean;
  }[];
}
```

**Example Content:**
```json
{
  "title": "The Impatient Customer",
  "situation": "A customer has been waiting in line for 10 minutes. When they reach you, they're visibly frustrated and say, 'I can't believe how long I had to wait. This is ridiculous!'",
  "question": "What is the best response?",
  "options": [
    {
      "text": "I'm sorry, but we're short-staffed today.",
      "feedback": "This sounds like an excuse and doesn't acknowledge their frustration. Try a more empathetic approach.",
      "is_best": false
    },
    {
      "text": "I apologize for the wait. I understand your time is valuable. How can I help you today?",
      "feedback": "Excellent! You acknowledged their frustration, apologized, and moved forward positively.",
      "is_best": true
    },
    {
      "text": "It wasn't that long. Other customers wait even longer.",
      "feedback": "This dismisses their feelings and could escalate the situation. Never minimize a customer's experience.",
      "is_best": false
    }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│  📋 Scenario: The Impatient Customer                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  A customer has been waiting in line for 10 minutes.│   │
│  │  When they reach you, they're visibly frustrated    │   │
│  │  and say, "I can't believe how long I had to wait.  │   │
│  │  This is ridiculous!"                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  What is the best response?                                │
│                                                             │
│  ○ "I'm sorry, but we're short-staffed today."            │
│                                                             │
│  ○ "I apologize for the wait. I understand your time is   │
│     valuable. How can I help you today?"                   │
│                                                             │
│  ○ "It wasn't that long. Other customers wait even        │
│     longer."                                                │
│                                                             │
│                                         [Submit Answer]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 8.6 Drag & Drop Practice Block

**Purpose:** Interactive matching or sorting activity.

**When to Use:** Practice, matching, categorization.

```typescript
interface DragDropBlockContent {
  title?: string;
  type: 'match' | 'sort' | 'order';
  items: {
    id: string;
    content: string;
  }[];
  targets?: {  // For 'match' and 'sort' types
    id: string;
    label: string;
    correct_items: string[];  // IDs of correct items
  }[];
  correct_order?: string[];  // For 'order' type - IDs in correct order
}
```

**Example Content:**
```json
{
  "title": "Match the Response Type",
  "type": "sort",
  "items": [
    { "id": "1", "content": "\"I understand how frustrating that must be.\"" },
    { "id": "2", "content": "\"Let me check on that for you right away.\"" },
    { "id": "3", "content": "\"That's not our policy.\"" },
    { "id": "4", "content": "\"Would you like a refund or replacement?\"" }
  ],
  "targets": [
    { "id": "good", "label": "Good Response", "correct_items": ["1", "2", "4"] },
    { "id": "bad", "label": "Avoid This", "correct_items": ["3"] }
  ]
}
```

---

## Category 9: Layout & Structure

### 9.1 Two Column Block

**Purpose:** Side-by-side content layout.

**When to Use:** Image + text, before/after, comparisons.

```typescript
interface TwoColumnBlockContent {
  left: {
    type: 'text' | 'image';
    content: string;  // Text or image URL
  };
  right: {
    type: 'text' | 'image';
    content: string;
  };
  ratio: '50-50' | '30-70' | '70-30';
  vertical_align: 'top' | 'center' | 'bottom';
}
```

**Example Content:**
```json
{
  "left": {
    "type": "image",
    "content": "https://storage.example.com/images/bad-posture.png"
  },
  "right": {
    "type": "text",
    "content": "**Body Language Matters**\n\nCrossed arms and avoiding eye contact signal disinterest. Instead, maintain open posture and make regular eye contact to show engagement."
  },
  "ratio": "30-70",
  "vertical_align": "center"
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────┐  ┌─────────────────────────────────┐    │
│  │               │  │                                 │    │
│  │   [IMAGE]     │  │  Body Language Matters          │    │
│  │               │  │                                 │    │
│  │               │  │  Crossed arms and avoiding eye  │    │
│  │               │  │  contact signal disinterest.    │    │
│  │               │  │  Instead, maintain open posture │    │
│  │               │  │  and make regular eye contact   │    │
│  │               │  │  to show engagement.            │    │
│  └───────────────┘  └─────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 9.2 Three Column Block

**Purpose:** Three content areas side by side.

**When to Use:** Feature grids, options, team members.

```typescript
interface ThreeColumnBlockContent {
  columns: {
    title?: string;
    icon?: string;
    content: string;
  }[];
}
```

**Example Content:**
```json
{
  "columns": [
    {
      "title": "Listen",
      "icon": "👂",
      "content": "Give customers your full attention. Let them explain without interruption."
    },
    {
      "title": "Understand",
      "icon": "🧠",
      "content": "Ask clarifying questions. Make sure you truly understand their needs."
    },
    {
      "title": "Solve",
      "icon": "✅",
      "content": "Offer solutions that address their specific situation."
    }
  ]
}
```

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │       👂        │ │       🧠        │ │      ✅       │ │
│  │     Listen      │ │   Understand    │ │     Solve     │ │
│  │                 │ │                 │ │               │ │
│  │ Give customers  │ │ Ask clarifying  │ │ Offer solutions│
│  │ your full       │ │ questions. Make │ │ that address  │ │
│  │ attention. Let  │ │ sure you truly  │ │ their specific│ │
│  │ them explain    │ │ understand their│ │ situation.    │ │
│  │ without         │ │ needs.          │ │               │ │
│  │ interruption.   │ │                 │ │               │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 9.3 Card Grid Block

**Purpose:** Grid of content cards.

**When to Use:** Team members, products, options, resources.

```typescript
interface CardGridBlockContent {
  title?: string;
  cards: {
    title: string;
    description: string;
    image_url?: string;
    link_url?: string;
    link_text?: string;
  }[];
  columns: 2 | 3 | 4;
}
```

**Example Content:**
```json
{
  "title": "Additional Resources",
  "cards": [
    {
      "title": "Customer Service Handbook",
      "description": "Complete guide to our service standards.",
      "image_url": "https://...",
      "link_url": "https://...",
      "link_text": "Download PDF"
    },
    {
      "title": "Video Library",
      "description": "Watch training videos anytime.",
      "image_url": "https://...",
      "link_url": "https://...",
      "link_text": "Browse Videos"
    }
  ],
  "columns": 2
}
```

---

### 9.4 Spacer Block

**Purpose:** Add vertical space between content.

**When to Use:** Layout breathing room, visual separation.

```typescript
interface SpacerBlockContent {
  height: 'small' | 'medium' | 'large' | 'xlarge';
}
```

**Example Content:**
```json
{
  "height": "large"
}
```

---

## Complete Block Type List

### Summary: All 48 Block Types

| # | Block Type | Category |
|---|------------|----------|
| 1 | Text | Text & Basic |
| 2 | Heading | Text & Basic |
| 3 | Quote | Text & Basic |
| 4 | Divider | Text & Basic |
| 5 | Bullet List | Lists & Steps |
| 6 | Numbered List | Lists & Steps |
| 7 | Numbered Steps | Lists & Steps |
| 8 | Checklist | Lists & Steps |
| 9 | Image | Media |
| 10 | Image Gallery | Media |
| 11 | Video | Media |
| 12 | Audio | Media |
| 13 | File Download | Media |
| 14 | Embed | Media |
| 15 | Accordion | Interactive |
| 16 | Tabs | Interactive |
| 17 | Flashcard | Interactive |
| 18 | Flashcard Deck | Interactive |
| 19 | Hotspot Image | Interactive |
| 20 | Slider/Carousel | Interactive |
| 21 | Reveal | Interactive |
| 22 | Table | Data & Comparison |
| 23 | Comparison | Data & Comparison |
| 24 | Timeline | Data & Comparison |
| 25 | Process Flow | Data & Comparison |
| 26 | Stats/Counter | Data & Comparison |
| 27 | Callout - Tip | Callouts |
| 28 | Callout - Warning | Callouts |
| 29 | Callout - Note | Callouts |
| 30 | Callout - Danger | Callouts |
| 31 | Callout - Info | Callouts |
| 32 | Callout - Success | Callouts |
| 33 | Highlight Box | Callouts |
| 34 | Glossary | Reference |
| 35 | Definition | Reference |
| 36 | Code Block | Reference |
| 37 | Formula | Reference |
| 38 | Citation | Reference |
| 39 | Knowledge Check | Engagement |
| 40 | Reflection | Engagement |
| 41 | Poll | Engagement |
| 42 | Discussion Prompt | Engagement |
| 43 | Scenario | Engagement |
| 44 | Drag & Drop | Engagement |
| 45 | Two Column | Layout |
| 46 | Three Column | Layout |
| 47 | Card Grid | Layout |
| 48 | Spacer | Layout |

---

## TypeScript Type Definitions

```typescript
// Master type for all content blocks
type ContentBlockType =
  // Text & Basic
  | 'text'
  | 'heading'
  | 'quote'
  | 'divider'
  // Lists & Steps
  | 'bullet_list'
  | 'numbered_list'
  | 'numbered_steps'
  | 'checklist'
  // Media
  | 'image'
  | 'image_gallery'
  | 'video'
  | 'audio'
  | 'file_download'
  | 'embed'
  // Interactive
  | 'accordion'
  | 'tabs'
  | 'flashcard'
  | 'flashcard_deck'
  | 'hotspot_image'
  | 'slider'
  | 'reveal'
  // Data & Comparison
  | 'table'
  | 'comparison'
  | 'timeline'
  | 'process_flow'
  | 'stats'
  // Callouts
  | 'callout'
  | 'highlight_box'
  // Reference
  | 'glossary'
  | 'definition'
  | 'code'
  | 'formula'
  | 'citation'
  // Engagement
  | 'knowledge_check'
  | 'reflection'
  | 'poll'
  | 'discussion'
  | 'scenario'
  | 'drag_drop'
  // Layout
  | 'two_column'
  | 'three_column'
  | 'card_grid'
  | 'spacer';

// Content block interface
interface ContentBlock {
  id: string;
  lesson_id: string;
  type: ContentBlockType;
  content: Record<string, any>;  // Type-specific content
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

---

## Database Schema

```sql
-- Content blocks table already created in main schema
-- This is the full type constraint:

ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS content_blocks_type_check;

ALTER TABLE content_blocks ADD CONSTRAINT content_blocks_type_check
CHECK (type IN (
  -- Text & Basic
  'text', 'heading', 'quote', 'divider',
  -- Lists & Steps
  'bullet_list', 'numbered_list', 'numbered_steps', 'checklist',
  -- Media
  'image', 'image_gallery', 'video', 'audio', 'file_download', 'embed',
  -- Interactive
  'accordion', 'tabs', 'flashcard', 'flashcard_deck', 'hotspot_image', 'slider', 'reveal',
  -- Data & Comparison
  'table', 'comparison', 'timeline', 'process_flow', 'stats',
  -- Callouts
  'callout', 'highlight_box',
  -- Reference
  'glossary', 'definition', 'code', 'formula', 'citation',
  -- Engagement
  'knowledge_check', 'reflection', 'poll', 'discussion', 'scenario', 'drag_drop',
  -- Layout
  'two_column', 'three_column', 'card_grid', 'spacer'
));
```
