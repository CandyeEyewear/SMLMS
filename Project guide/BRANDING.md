# LMS Platform - Branding & Design System

## Overview

This document defines the visual identity for the LMS platform at two levels:
1. **Platform Branding** - Sales Master Consultants as the platform owner
2. **Company White-Label** - Client company customization

---

## Platform Branding (Sales Master Consultants)

### Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary (Deep Blue)** | `#1A4490` | rgb(26, 68, 144) | Headers, navigation, primary buttons |
| **Accent (Teal)** | `#2BB5C5` | rgb(43, 181, 197) | CTAs, links, highlights, success states |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Backgrounds, text on dark surfaces |
| **Neutral (Warm Gray)** | `#C4BEB5` | rgb(196, 190, 181) | Borders, dividers, secondary backgrounds |

### Extended Palette

```
Primary Scale (Deep Blue)
─────────────────────────
50:  #E8EDF5
100: #C5D3E8
200: #9FB5D9
300: #7897CA
400: #5179BB
500: #1A4490  ← Primary
600: #163A7A
700: #123064
800: #0E264E
900: #0A1C38

Accent Scale (Teal)
───────────────────
50:  #E6F7F9
100: #C0EBEF
200: #99DFE5
300: #73D3DB
400: #4CC7D1
500: #2BB5C5  ← Accent
600: #24969F
700: #1D7779
800: #165853
900: #0F392D

Neutral Scale (Warm Gray)
─────────────────────────
50:  #FAFAF9
100: #F5F4F2
200: #ECEAE6
300: #E0DDD8
400: #D2CEC7
500: #C4BEB5  ← Base Neutral
600: #A8A299
700: #8C867D
800: #706A61
900: #544E45

Gray Scale (Cool)
─────────────────
50:  #F9FAFB
100: #F3F4F6
200: #E5E7EB
300: #D1D5DB
400: #9CA3AF
500: #6B7280
600: #4B5563
700: #374151
800: #1F2937
900: #111827
```

### Semantic Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Success | Green | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |
| Info | Blue | `#3B82F6` |

### Logo

**Primary Logo:** Sales Master Consultants logo
**File Formats Required:**
- `logo-full.svg` - Full logo with text
- `logo-full.png` - Full logo PNG (transparent)
- `logo-icon.svg` - Icon only
- `logo-icon.png` - Icon only PNG (transparent)
- `logo-white.svg` - White version for dark backgrounds
- `logo-white.png` - White version PNG

**Logo Placement:**
- Login page: Centered, full logo
- Super Admin sidebar: Icon or full logo (collapsed/expanded)
- Email headers: Full logo, max height 60px
- Favicon: Icon version

---

## Company White-Label Branding

### Database Fields

Each company can customize:

```sql
companies (
  logo_url TEXT,           -- Company logo (stored in Supabase Storage)
  primary_color TEXT,      -- Main brand color (hex)
  secondary_color TEXT,    -- Supporting color (hex)
  -- Future expansion via settings JSONB:
  -- accent_color, font_family, custom_css, etc.
)
```

### Default Values (New Companies)

When a company is created without branding:

```typescript
const DEFAULT_COMPANY_BRANDING = {
  primary_color: '#1A4490',    // Falls back to platform primary
  secondary_color: '#2BB5C5',  // Falls back to platform accent
  logo_url: null,              // Shows company name as text
};
```

### White-Label Application

| Element | Uses Company Branding |
|---------|----------------------|
| Company Admin sidebar | Primary color |
| Company Admin header | Primary color |
| Learner dashboard | Primary color |
| Course player header | Primary color |
| Buttons (primary) | Primary color |
| Links | Secondary color |
| Progress bars | Secondary color |
| Certificates | Logo + primary color |
| Email templates | Logo + primary color |
| Login page (if custom domain) | Full branding |

### CSS Variable Implementation

```css
:root {
  /* Platform defaults */
  --color-primary: #1A4490;
  --color-accent: #2BB5C5;
  --color-neutral: #C4BEB5;
  --color-white: #FFFFFF;
  
  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Surfaces */
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  
  /* Text */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-text-inverse: #FFFFFF;
}

/* Company override (applied via JavaScript) */
[data-company-theme] {
  --color-primary: var(--company-primary);
  --color-accent: var(--company-secondary);
}
```

### Dynamic Theme Application

```typescript
// apps/web/lib/theme.ts

export function applyCompanyTheme(company: {
  primary_color?: string;
  secondary_color?: string;
}) {
  const root = document.documentElement;
  
  if (company.primary_color) {
    root.style.setProperty('--company-primary', company.primary_color);
  }
  
  if (company.secondary_color) {
    root.style.setProperty('--company-secondary', company.secondary_color);
  }
  
  root.setAttribute('data-company-theme', 'true');
}

export function resetToDefaultTheme() {
  const root = document.documentElement;
  root.removeAttribute('data-company-theme');
  root.style.removeProperty('--company-primary');
  root.style.removeProperty('--company-secondary');
}
```

---

## Typography

### Font Stack

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Font Installation

**Inter** (Primary font)
- Source: Google Fonts or self-hosted
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 36px | 700 | 1.2 | Page titles |
| H1 | 30px | 700 | 1.2 | Section headers |
| H2 | 24px | 600 | 1.3 | Subsection headers |
| H3 | 20px | 600 | 1.4 | Card titles |
| H4 | 18px | 600 | 1.4 | Small headers |
| Body Large | 18px | 400 | 1.6 | Lead paragraphs |
| Body | 16px | 400 | 1.6 | Default text |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 400 | 1.4 | Labels, hints |

### Tailwind Configuration

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8EDF5',
          100: '#C5D3E8',
          200: '#9FB5D9',
          300: '#7897CA',
          400: '#5179BB',
          500: '#1A4490',
          600: '#163A7A',
          700: '#123064',
          800: '#0E264E',
          900: '#0A1C38',
        },
        accent: {
          50: '#E6F7F9',
          100: '#C0EBEF',
          200: '#99DFE5',
          300: '#73D3DB',
          400: '#4CC7D1',
          500: '#2BB5C5',
          600: '#24969F',
          700: '#1D7779',
          800: '#165853',
          900: '#0F392D',
        },
        neutral: {
          50: '#FAFAF9',
          100: '#F5F4F2',
          200: '#ECEAE6',
          300: '#E0DDD8',
          400: '#D2CEC7',
          500: '#C4BEB5',
          600: '#A8A299',
          700: '#8C867D',
          800: '#706A61',
          900: '#544E45',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
};
```

---

## Spacing

Using Tailwind's default spacing scale (4px base):

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Compact elements |
| md | 16px | Default spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| 2xl | 48px | Page sections |
| 3xl | 64px | Major sections |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| none | 0 | No rounding |
| sm | 4px | Subtle rounding |
| md | 8px | Default (buttons, inputs) |
| lg | 12px | Cards |
| xl | 16px | Modals |
| full | 9999px | Pills, avatars |

---

## Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

---

## Component Styling Guidelines

### Buttons

```
Primary Button
─────────────
Background: var(--color-primary)
Text: White
Hover: 10% darker
Border Radius: md (8px)
Padding: 12px 24px
Font: 14px, 500 weight

Secondary Button
────────────────
Background: Transparent
Border: 1px solid var(--color-primary)
Text: var(--color-primary)
Hover: Primary background, white text

Accent Button
─────────────
Background: var(--color-accent)
Text: White
Hover: 10% darker
Used for: CTAs, important actions
```

### Cards

```
Default Card
────────────
Background: White
Border: 1px solid var(--color-border)
Border Radius: lg (12px)
Shadow: shadow-sm
Padding: 24px

Elevated Card
─────────────
Background: White
Border: None
Border Radius: lg (12px)
Shadow: shadow-md
Padding: 24px
```

### Inputs

```
Default Input
─────────────
Background: White
Border: 1px solid var(--color-border)
Border Radius: md (8px)
Padding: 12px 16px
Focus: Border color var(--color-primary)
Error: Border color var(--color-error)
```

### Navigation

```
Sidebar (Super Admin)
─────────────────────
Background: var(--color-primary) [#1A4490]
Text: White
Active Item: White background, primary text
Icon Color: White (inactive), Primary (active)

Sidebar (Company Admin / Learner)
─────────────────────────────────
Background: var(--company-primary) or var(--color-primary)
Text: White
Active Item: rgba(255,255,255,0.2) background
```

---

## Dark Mode (Future)

Not included in initial release. Design tokens support future dark mode:

```css
[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-border: #374151;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
}
```

---

## Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio

**Verified combinations:**
- White text on Primary (#1A4490): 8.2:1 ✓
- White text on Accent (#2BB5C5): 3.1:1 ✓ (large text only)
- Primary text on White: 8.2:1 ✓
- Gray-700 on White: 4.8:1 ✓

### Focus States

All interactive elements must have visible focus states:

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## File Assets Required

```
public/
├── images/
│   ├── logo/
│   │   ├── salesmaster-full.svg
│   │   ├── salesmaster-full.png
│   │   ├── salesmaster-icon.svg
│   │   ├── salesmaster-icon.png
│   │   ├── salesmaster-white.svg
│   │   └── salesmaster-white.png
│   └── defaults/
│       ├── avatar-placeholder.svg
│       ├── course-thumbnail-placeholder.svg
│       └── company-logo-placeholder.svg
├── favicon.ico
├── apple-touch-icon.png
└── og-image.png
```

---

## Summary

| Aspect | Value |
|--------|-------|
| Primary Color | #1A4490 (Deep Blue) |
| Accent Color | #2BB5C5 (Teal) |
| Neutral Color | #C4BEB5 (Warm Gray) |
| Font | Inter |
| Border Radius | 8px default |
| Spacing Base | 4px |

This design system ensures visual consistency across the platform while allowing client companies to maintain their own brand identity through white-labeling.
