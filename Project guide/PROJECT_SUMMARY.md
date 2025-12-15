# LMS Project Summary (Quick Reference)

## Project
AI-powered corporate training LMS for **Sales Master Consultants**

## Tech Stack
- **Web**: Next.js 15, React 19, Tailwind CSS
- **Mobile**: Expo SDK 54 (Phase 2)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: GPT-4o (text), DALL-E 3 (images)
- **Payments**: eZeePayments

## Brand Colors
| Color | Hex |
|-------|-----|
| Primary (Deep Blue) | #1A4490 |
| Accent (Teal) | #2BB5C5 |
| Neutral (Warm Gray) | #C4BEB5 |
| White | #FFFFFF |

## User Roles
1. **Super Admin** - Platform owner, creates courses, manages companies
2. **Company Admin** - Client admin, manages team, assigns courses
3. **User** - Learner, completes courses

## Database
- **34 tables** total
- Key tables: companies, profiles, groups, courses, modules, lessons, quizzes, enrollments, invite_links

## User Addition Methods (Company Admin)
1. Manual entry (one by one)
2. Bulk CSV upload
3. Shareable invite link (self-registration)

## Course Structure
Course → Modules → Lessons + Quiz (per module)

## Design Principles
- Modern, futuristic, professional, simple
- Clean whitespace, minimal borders
- Subtle shadows, no clutter
- Progressive disclosure

## Documents Created
- lms_schema.sql (complete database)
- lms_schema_summary.md
- BRANDING.md
- DESIGN_PRINCIPLES.md
- USER_MANAGEMENT_WORKFLOWS.md
- tailwind.config.js
- constants.ts
- .env.example
- README.md

## Current Status
Documentation phase complete. Ready to begin development Phase 1A: Foundation.
