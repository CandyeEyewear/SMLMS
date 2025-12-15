# LMS Platform - Design Principles & UI Guidelines

## Design Philosophy

**Modern. Futuristic. Professional. Simple.**

The interface should feel like it belongs in 2025 and beyond. Clean lines, generous whitespace, subtle depth, and purposeful design. Every element earns its place on screen.

---

## Core Principles

### 1. Breathe

**Whitespace is not wasted space.**

- Generous padding and margins
- Content never feels cramped
- Elements have room to stand out
- Minimum 24px spacing between sections
- Minimum 16px spacing between related items

```
BAD:  Elements crammed together, busy, overwhelming
GOOD: Elements spaced apart, calm, focused
```

### 2. Less is More

**If it doesn't serve a purpose, remove it.**

- No decorative elements for decoration's sake
- No unnecessary borders or dividers
- No redundant labels or text
- One primary action per view
- Hide complexity until needed

```
BAD:  10 buttons visible at once
GOOD: 1-2 primary actions, rest in contextual menus
```

### 3. Clarity Over Cleverness

**Users should never wonder what something does.**

- Clear, simple language
- Obvious interactive elements
- Consistent patterns throughout
- No jargon or technical terms
- Actions labeled with verbs

```
BAD:  "Initiate Course Generation Protocol"
GOOD: "Create Course"
```

### 4. Progressive Disclosure

**Show what's needed, when it's needed.**

- Start simple, reveal complexity on demand
- Use expandable sections for details
- Wizards for multi-step processes
- Contextual actions appear on hover/focus
- Advanced options tucked away but accessible

---

## Visual Language

### Color Usage

**Restraint is key. Color should guide, not overwhelm.**

| Usage | Color | When to Use |
|-------|-------|-------------|
| Primary actions | Deep Blue `#1A4490` | Primary buttons, active nav items |
| Interactive elements | Teal `#2BB5C5` | Links, hover states, progress |
| Backgrounds | White / Light Gray | Page backgrounds, cards |
| Text | Dark Gray `#111827` | Body text, headings |
| Secondary text | Medium Gray `#6B7280` | Captions, hints, metadata |
| Borders | Light Gray `#E5E7EB` | Subtle separation only |
| Success | Green `#10B981` | Completion, success states |
| Warning | Amber `#F59E0B` | Caution, pending states |
| Error | Red `#EF4444` | Errors, destructive actions |

**Rules:**
- Maximum 3 colors visible at once (excluding gray scale)
- Use color sparingly for emphasis
- Gray scale for most UI elements
- Color draws attention to what matters

### Backgrounds

**Subtle depth, not decoration.**

```css
/* Primary background */
background: #FFFFFF;

/* Secondary background (cards on page) */
background: #F9FAFB;

/* Subtle depth for elevated elements */
background: linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%);

/* Futuristic subtle glow (use sparingly) */
background: radial-gradient(ellipse at top, rgba(43, 181, 197, 0.05) 0%, transparent 50%);
```

### Borders & Dividers

**Minimal. Often unnecessary.**

- Prefer whitespace over borders for separation
- When borders are needed: `1px solid #E5E7EB`
- No heavy or dark borders
- No double borders
- Consider shadow instead of border for elevation

```
BAD:  Every card has a thick border
GOOD: Cards use subtle shadow, no border
```

### Shadows

**Subtle elevation, not heavy drop shadows.**

```css
/* Default card shadow - barely visible */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

/* Elevated (modals, dropdowns) */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Hover state */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
```

### Border Radius

**Consistent, modern, not too rounded.**

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Inputs | 8px |
| Cards | 12px |
| Modals | 16px |
| Small elements (tags, badges) | 6px |
| Pills, avatars | 9999px (full) |

---

## Typography

### Hierarchy

**Clear visual hierarchy. No more than 3 levels visible at once.**

```
Page Title (24-30px, Semibold)
    Section Header (18-20px, Medium)
        Body Text (16px, Regular)
        Secondary Text (14px, Regular, Gray)
```

### Font Weights

| Weight | Usage |
|--------|-------|
| 400 (Regular) | Body text, descriptions |
| 500 (Medium) | Subheadings, labels, buttons |
| 600 (Semibold) | Headings, important text |
| 700 (Bold) | Rarely - only page titles |

### Line Length

- Maximum 70-80 characters per line for readability
- Content areas should not stretch full width on large screens

---

## Layout Patterns

### Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (220px)  │  MAIN CONTENT                              │
│                   │                                             │
│  Navigation       │  ┌─────────────────────────────────────┐   │
│  - Clean          │  │ Page Header                         │   │
│  - Minimal        │  │ Title + Actions                     │   │
│  - Grouped        │  └─────────────────────────────────────┘   │
│                   │                                             │
│                   │  ┌─────────────────────────────────────┐   │
│                   │  │                                     │   │
│                   │  │  Content Area                       │   │
│                   │  │  (max-width: 1200px)                │   │
│                   │  │                                     │   │
│                   │  │  Generous padding: 32px             │   │
│                   │  │                                     │   │
│                   │  └─────────────────────────────────────┘   │
│                   │                                             │
└─────────────────────────────────────────────────────────────────┘
```

### Card Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   Title                        Action   │
│   Subtitle or description              │
│                                         │
│   ─────────────────────────────────    │
│                                         │
│   Content                              │
│                                         │
│                                         │
└─────────────────────────────────────────┘

- Padding: 24px
- No border (use subtle shadow)
- Clear hierarchy within
- Single action or grouped actions in corner
```

### Data Tables

```
┌─────────────────────────────────────────────────────────────────┐
│  Name              │ Status      │ Progress    │ Actions       │
├─────────────────────────────────────────────────────────────────┤
│  John Smith        │ ● Active    │ ████░░ 67%  │ ⋯            │
│                    │             │             │               │
│  Jane Doe          │ ● Active    │ ██████ 100% │ ⋯            │
│                    │             │             │               │
│  Bob Johnson       │ ○ Inactive  │ ░░░░░░ 0%   │ ⋯            │
└─────────────────────────────────────────────────────────────────┘

- Generous row height (56px minimum)
- Subtle alternating row colors (optional)
- Actions hidden in menu (⋯) not multiple buttons
- Clean header, no heavy styling
- Hover state shows row highlight
```

### Stats Cards

```
┌───────────────────┐
│                   │
│  Total Users      │
│                   │
│  487              │
│  +34 this week    │
│                   │
└───────────────────┘

- Large number, prominent
- Small label above or below
- Optional trend indicator
- No icons unless truly helpful
- No decorative backgrounds
```

---

## Components

### Buttons

**Hierarchy: Primary → Secondary → Tertiary**

```
PRIMARY (Deep Blue background, white text)
┌─────────────────┐
│   Create Course │
└─────────────────┘
- One per view maximum
- Reserved for main action

SECONDARY (Outline or subtle background)
┌─────────────────┐
│     Cancel      │
└─────────────────┘
- Supporting actions
- Less visual weight

TERTIARY (Text only, minimal styling)
  Learn More →
- Navigation, minor actions
- Underline on hover
```

**Button Sizing:**
- Default: 40px height, 16px horizontal padding
- Small: 32px height, 12px padding
- Large: 48px height, 24px padding

### Inputs

```
┌─────────────────────────────────────────┐
│ placeholder text                        │
└─────────────────────────────────────────┘

- Height: 44px
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Focus: Blue border, subtle glow
- Label above (not inside)
- Helper text below in gray
```

### Navigation (Sidebar)

```
┌─────────────────────┐
│                     │
│  [Logo]             │
│                     │
│  ─────────────────  │
│                     │
│  Dashboard          │  ← Active: Background highlight
│                     │
│  Courses            │  ← Hover: Subtle background
│                     │
│  Team               │
│                     │
│  Reports            │
│                     │
│  ─────────────────  │
│                     │
│  Settings           │
│                     │
└─────────────────────┘

- Clean, text-based
- Icons optional (simple line icons only)
- No heavy backgrounds
- Clear active state
- Grouped by function with subtle dividers
```

### Empty States

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         [Simple illustration]           │
│                                         │
│         No courses yet                  │
│                                         │
│   Create your first course to get       │
│   started with training.                │
│                                         │
│         [ Create Course ]               │
│                                         │
│                                         │
└─────────────────────────────────────────┘

- Simple, minimal illustration
- Clear message
- Single action
- Centered, not overwhelming
```

### Modals

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                           ✕     │
│                                                                 │
│   Modal Title                                                   │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│   Content goes here. Keep it focused.                          │
│   One purpose per modal.                                        │
│                                                                 │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│                               [ Cancel ]  [ Confirm Action ]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Generous padding (32px)
- Subtle backdrop blur (optional)
- Max width: 480px for simple, 640px for complex
- Actions at bottom right
- Easy to dismiss
```

---

## Motion & Interaction

### Transitions

**Smooth but quick. Never slow the user down.**

```css
/* Default transition */
transition: all 0.15s ease;

/* Hover states */
transition: all 0.1s ease;

/* Modals, larger elements */
transition: all 0.2s ease-out;
```

### Hover States

- Buttons: Slightly darker background
- Cards: Subtle shadow increase
- Links: Underline appears or color shifts
- Table rows: Light background highlight

### Loading States

- Skeleton screens for content loading
- Subtle shimmer animation
- Spinner only for quick actions (< 2 seconds)
- Progress bar for longer operations

---

## What to Avoid

### Do NOT Use

| Element | Why |
|---------|-----|
| Gradients on buttons | Dated look |
| Heavy drop shadows | Looks cheap |
| Multiple fonts | Creates chaos |
| Icon overload | Adds clutter |
| Animated backgrounds | Distracting |
| Rounded everything (> 16px) | Looks cartoonish |
| Thick borders | Heavy, dated |
| All caps text (except small labels) | Hard to read |
| Decorative shapes | Unnecessary clutter |
| Stock photography | Generic feel |
| Too many colors | Overwhelming |
| Dense tables | Hard to scan |
| Multiple CTAs competing | Confusing |

### Do NOT

- Put more than 5-7 items in a table without pagination
- Use more than 2 font sizes on a card
- Add borders when whitespace works
- Show all options at once (use progressive disclosure)
- Use icons without labels for primary navigation
- Create busy dashboards with too many widgets
- Use color for decoration

---

## Dashboard Design

**Dashboards should be scannable, not overwhelming.**

### Rules

1. **Maximum 4-6 stat cards** at the top
2. **One primary focus area** (chart, list, or activity feed)
3. **Secondary information** below the fold
4. **Actions grouped** in page header, not scattered
5. **Whitespace between sections** (32px minimum)

### Example Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Good morning, Davor                              [ + New ]     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Users   │  │ Courses │  │ Active  │  │ Revenue │            │
│  │ 487     │  │ 24      │  │ 89%     │  │ $12.4k  │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Needs Attention                                   View All →   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 12 users overdue on Compliance Training          [View] │   │
│  │ 3 course requests pending                        [View] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Recent Activity                                                │
│                                                                 │
│  • Jane completed "Safety Training" - 2 hours ago              │
│  • New user added: Bob Johnson - Yesterday                     │
│  • Course published: "Data Privacy" - 2 days ago               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Futuristic Touches (Subtle)

These add a modern feel without being gimmicky:

### Subtle Glass Effect (Cards)

```css
.card-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Subtle Glow on Focus

```css
input:focus {
  border-color: #2BB5C5;
  box-shadow: 0 0 0 3px rgba(43, 181, 197, 0.1);
}
```

### Smooth Number Animations

```css
.stat-number {
  transition: all 0.3s ease-out;
}
```

### Progress Bar Glow

```css
.progress-bar {
  background: linear-gradient(90deg, #1A4490, #2BB5C5);
  box-shadow: 0 0 8px rgba(43, 181, 197, 0.3);
}
```

---

## Summary

| Principle | Implementation |
|-----------|----------------|
| **Clean** | Whitespace, minimal borders, subtle shadows |
| **Modern** | Smooth transitions, subtle glass effects |
| **Futuristic** | Teal accents, glows, gradient progress bars |
| **Professional** | Restrained color, clear typography |
| **Simple** | Progressive disclosure, minimal actions visible |

**When in doubt, remove something.**
