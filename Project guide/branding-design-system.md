# LMS Platform - Branding & Design System

## Overview

This document defines the visual identity for the LMS platform at two levels:

1. **Platform Branding** - The core LMS product identity (what Super Admin sees)
2. **Company Branding** - White-label customization for each client company

---

## 1. Platform Branding

### 1.1 Platform Identity

| Element | Value | Notes |
|---------|-------|-------|
| Platform Name | [Your Platform Name] | To be decided |
| Tagline | [Optional tagline] | e.g., "AI-Powered Corporate Training" |
| Logo | [To be designed] | Primary and icon versions needed |

### 1.2 Platform Color Palette

#### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | #2563EB | rgb(37, 99, 235) | Primary buttons, links, active states |
| Primary Dark | #1D4ED8 | rgb(29, 78, 216) | Hover states, emphasis |
| Primary Light | #3B82F6 | rgb(59, 130, 246) | Backgrounds, highlights |

#### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Secondary | #0F172A | rgb(15, 23, 42) | Headers, primary text |
| Secondary Light | #1E293B | rgb(30, 41, 59) | Sidebar, navigation |

#### Neutral Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Gray 50 | #F8FAFC | rgb(248, 250, 252) | Page backgrounds |
| Gray 100 | #F1F5F9 | rgb(241, 245, 249) | Card backgrounds, borders |
| Gray 200 | #E2E8F0 | rgb(226, 232, 240) | Dividers, borders |
| Gray 300 | #CBD5E1 | rgb(203, 213, 225) | Disabled states |
| Gray 400 | #94A3B8 | rgb(148, 163, 184) | Placeholder text |
| Gray 500 | #64748B | rgb(100, 116, 139) | Secondary text |
| Gray 600 | #475569 | rgb(71, 85, 105) | Body text |
| Gray 700 | #334155 | rgb(51, 65, 85) | Headings |
| Gray 800 | #1E293B | rgb(30, 41, 59) | Primary text |
| Gray 900 | #0F172A | rgb(15, 23, 42) | Darkest text |

#### Semantic Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Success | #10B981 | rgb(16, 185, 129) | Success messages, completed states |
| Success Light | #D1FAE5 | rgb(209, 250, 229) | Success backgrounds |
| Warning | #F59E0B | rgb(245, 158, 11) | Warnings, pending states |
| Warning Light | #FEF3C7 | rgb(254, 243, 199) | Warning backgrounds |
| Error | #EF4444 | rgb(239, 68, 68) | Errors, destructive actions |
| Error Light | #FEE2E2 | rgb(254, 226, 226) | Error backgrounds |
| Info | #3B82F6 | rgb(59, 130, 246) | Information, tips |
| Info Light | #DBEAFE | rgb(219, 234, 254) | Info backgrounds |

### 1.3 Typography

#### Font Family

| Usage | Font | Fallback |
|-------|------|----------|
| Primary | Inter | system-ui, sans-serif |
| Monospace | JetBrains Mono | monospace |

#### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px | 16px | Labels, captions |
| sm | 14px | 20px | Secondary text, table cells |
| base | 16px | 24px | Body text |
| lg | 18px | 28px | Large body text |
| xl | 20px | 28px | Card titles |
| 2xl | 24px | 32px | Section headings |
| 3xl | 30px | 36px | Page titles |
| 4xl | 36px | 40px | Hero text |

#### Font Weights

| Name | Weight | Usage |
|------|--------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Emphasis, labels |
| Semibold | 600 | Subheadings, buttons |
| Bold | 700 | Headings |

### 1.4 Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| 0 | 0px | - |
| 1 | 4px | Tight spacing |
| 2 | 8px | Small gaps |
| 3 | 12px | Medium gaps |
| 4 | 16px | Standard spacing |
| 5 | 20px | Section padding |
| 6 | 24px | Card padding |
| 8 | 32px | Large gaps |
| 10 | 40px | Section margins |
| 12 | 48px | Page sections |
| 16 | 64px | Large sections |

### 1.5 Border Radius

| Name | Value | Usage |
|------|-------|-------|
| none | 0px | Sharp corners |
| sm | 4px | Small elements, tags |
| md | 6px | Buttons, inputs |
| lg | 8px | Cards, modals |
| xl | 12px | Large cards |
| 2xl | 16px | Feature cards |
| full | 9999px | Avatars, pills |

### 1.6 Shadows

| Name | Value | Usage |
|------|-------|-------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| md | 0 4px 6px rgba(0,0,0,0.1) | Cards, dropdowns |
| lg | 0 10px 15px rgba(0,0,0,0.1) | Modals, popovers |
| xl | 0 20px 25px rgba(0,0,0,0.15) | Dialogs |

---

## 2. Company White-Label Branding

### 2.1 Customizable Elements

Companies can customize:

| Element | Description | Default |
|---------|-------------|---------|
| Logo | Company logo (displayed in header, emails) | Platform logo |
| Primary Color | Main brand color | #3B82F6 |
| Secondary Color | Accent color | #1E40AF |
| Custom Domain | training.company.com (Enterprise only) | app.platform.com |

### 2.2 Default Company Branding

When a new company is created, these defaults apply:

```json
{
  "logo_url": null,
  "primary_color": "#3B82F6",
  "secondary_color": "#1E40AF"
}
```

### 2.3 Color Application in White-Label

When a company sets custom colors, they are applied to:

| Element | Color Used |
|---------|------------|
| Primary buttons | Primary Color |
| Links | Primary Color |
| Active navigation items | Primary Color |
| Progress bars | Primary Color |
| Header accent | Primary Color |
| Focus rings | Primary Color |
| Secondary buttons | Secondary Color |
| Icons (where applicable) | Secondary Color |

### 2.4 Branding Constraints

To ensure readability and accessibility:

| Constraint | Rule |
|------------|------|
| Contrast ratio | Minimum 4.5:1 for text on colored backgrounds |
| Logo dimensions | Max 200x60px, displayed at max 160x40px |
| Logo format | PNG, SVG, or WebP with transparency |
| Color format | Valid hex codes only |

### 2.5 Where Branding Appears

**Company Logo:**
- Company Admin dashboard header
- Learner dashboard header
- Email headers
- Certificate headers
- Login page (if custom domain)

**Company Colors:**
- All UI elements for Company Admin and Learners
- Email templates
- Certificates
- Progress indicators

**Platform Branding Only (not customizable):**
- Super Admin interface
- Platform marketing pages
- Platform emails to Super Admin

---

## 3. Implementation

### 3.1 Tailwind Configuration

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        // Platform colors (fixed)
        platform: {
          primary: '#2563EB',
          'primary-dark': '#1D4ED8',
          'primary-light': '#3B82F6',
        },
        
        // Dynamic company colors (CSS variables)
        brand: {
          primary: 'var(--brand-primary, #3B82F6)',
          secondary: 'var(--brand-secondary, #1E40AF)',
        },
        
        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
      },
    },
  },
};
```

### 3.2 CSS Variables for Dynamic Branding

```css
/* globals.css */

:root {
  /* Default brand colors (overridden per company) */
  --brand-primary: #3B82F6;
  --brand-secondary: #1E40AF;
  
  /* Derived colors (calculated from primary) */
  --brand-primary-hover: color-mix(in srgb, var(--brand-primary) 90%, black);
  --brand-primary-light: color-mix(in srgb, var(--brand-primary) 20%, white);
}
```

### 3.3 Applying Company Branding (React)

```typescript
// components/BrandingProvider.tsx

'use client';

import { useEffect } from 'react';
import { useCompanyBranding } from '@/hooks/use-company-branding';

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { branding } = useCompanyBranding();

  useEffect(() => {
    if (branding) {
      document.documentElement.style.setProperty(
        '--brand-primary',
        branding.primary_color
      );
      document.documentElement.style.setProperty(
        '--brand-secondary',
        branding.secondary_color
      );
    }
  }, [branding]);

  return <>{children}</>;
}
```

### 3.4 Logo Component

```typescript
// components/CompanyLogo.tsx

import Image from 'next/image';
import { useCompanyBranding } from '@/hooks/use-company-branding';

interface CompanyLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function CompanyLogo({ 
  className, 
  width = 160, 
  height = 40 
}: CompanyLogoProps) {
  const { branding } = useCompanyBranding();
  
  if (branding?.logo_url) {
    return (
      <Image
        src={branding.logo_url}
        alt="Company Logo"
        width={width}
        height={height}
        className={className}
      />
    );
  }
  
  // Fallback to platform logo
  return (
    <Image
      src="/logo.svg"
      alt="Platform Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
```

---

## 4. When to Configure Branding

### 4.1 Platform Branding (Development Phase)

**When:** Phase 1A - Foundation (Week 1-2)

**Tasks:**
1. Finalize platform name
2. Design or commission logo
3. Confirm color palette
4. Set up Tailwind configuration
5. Create base components with platform styling

### 4.2 Default Company Branding

**When:** Phase 1B - Super Admin Core (Week 3-4)

**Tasks:**
1. Define default values in database
2. Implement BrandingProvider component
3. Test white-label switching

### 4.3 Company Branding Settings

**When:** Phase 1C - Company Admin Core (Week 5-6)

**Tasks:**
1. Build branding settings page for Company Admin
2. Logo upload to Supabase Storage
3. Color picker component
4. Live preview of branding changes
5. Validation (contrast, format)

---

## 5. Branding Settings Interface

### 5.1 Super Admin: Creating a Company

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CREATE COMPANY                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  COMPANY INFORMATION                                                        │
│  ─────────────────────────────────────────────────────────────────────     │
│  Company Name *                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Acme Corporation                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  URL Slug *                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ acme-corp                                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  Users will access: app.platform.com/acme-corp                             │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  BRANDING (Optional - Company Admin can set later)                         │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  Logo                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Upload Logo]  or leave blank for default                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Primary Color          Secondary Color                                     │
│  ┌───────────────┐     ┌───────────────┐                                   │
│  │ #3B82F6  [■]  │     │ #1E40AF  [■]  │                                   │
│  └───────────────┘     └───────────────┘                                   │
│                                                                             │
│                                               [Cancel]  [Create Company]    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Company Admin: Branding Settings

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPANY SETTINGS > BRANDING                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LOGO                                                                       │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  Current Logo:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                       │   │
│  │              [Current logo preview]                                  │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Upload New Logo]  [Remove Logo]                                          │
│                                                                             │
│  Requirements: PNG, SVG, or WebP. Max 2MB. Recommended: 400x120px          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  COLORS                                                                     │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  Primary Color               Secondary Color                                │
│  ┌─────────────────────┐    ┌─────────────────────┐                        │
│  │                     │    │                     │                        │
│  │   [Color Picker]    │    │   [Color Picker]    │                        │
│  │                     │    │                     │                        │
│  │   #3B82F6           │    │   #1E40AF           │                        │
│  └─────────────────────┘    └─────────────────────┘                        │
│                                                                             │
│  Used for: buttons, links,   Used for: accents,                            │
│  active states, progress     secondary buttons                              │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  PREVIEW                                                                    │
│  ─────────────────────────────────────────────────────────────────────     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [Live preview of dashboard with selected branding]                  │   │
│  │                                                                       │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │ [Logo]                                          User Name    │   │   │
│  │  ├──────────────────────────────────────────────────────────────┤   │   │
│  │  │                                                              │   │   │
│  │  │  Sample content with [Primary Button] and links              │   │   │
│  │  │                                                              │   │   │
│  │  │  Progress: ████████████░░░░░░░░░░ 60%                       │   │   │
│  │  │                                                              │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                                [Reset to Default]  [Save]   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Decision Required

Before development begins, you need to decide:

| Decision | Options | Notes |
|----------|---------|-------|
| Platform Name | [Your choice] | Used throughout UI, emails, docs |
| Platform Logo | Design/commission OR use text initially | Can update later |
| Platform Primary Color | #2563EB (recommended) OR custom | Blue conveys trust, professionalism |
| Platform Secondary Color | #0F172A (recommended) OR custom | Dark slate for contrast |

The defaults in this document work well for most corporate training platforms. You can proceed with these and adjust later if needed.
