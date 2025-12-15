# LMS Platform

AI-Powered Corporate Training Platform by Sales Master Consultants

## Overview

A multi-tenant Learning Management System that enables corporate training through AI-generated course content. Built with Next.js 15, Supabase, and OpenAI.

## Features

- **AI Course Generation** - Create courses from prompts using GPT-4 and DALL-E
- **Multi-Tenant Architecture** - Serve multiple companies with data isolation
- **White-Label Branding** - Each company gets customized branding
- **Role-Based Access** - Super Admin, Company Admin, and User roles
- **Progress Tracking** - Comprehensive learner analytics
- **Offline Support** - Mobile app with offline learning (Phase 2)
- **Payment Integration** - eZeePayments for setup fees and subscriptions

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web Frontend | Next.js 15, React 19, Tailwind CSS |
| Mobile (Phase 2) | Expo SDK 54, React Native |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| AI | OpenAI API (GPT-4o, DALL-E 3) |
| Payments | eZeePayments |
| State Management | Zustand, TanStack Query |
| Forms | React Hook Form, Zod |

## Project Structure

```
lms-platform/
├── apps/
│   ├── web/                    # Next.js web application
│   └── mobile/                 # Expo mobile app (Phase 2)
├── packages/
│   ├── shared/                 # Shared types, utilities
│   └── database/               # Database types, queries
├── supabase/
│   ├── migrations/             # Database migrations
│   ├── functions/              # Edge Functions
│   └── seed.sql                # Seed data
├── docs/                       # Documentation
└── turbo.json                  # Turborepo config
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- OpenAI API key
- eZeePayments merchant account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/lms-platform.git
cd lms-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Set up Supabase**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

5. **Start development server**

```bash
npm run dev
```

6. **Open the application**

Visit `http://localhost:3000`

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key
- `EZEE_MERCHANT_ID` - eZeePayments merchant ID

## Database Schema

The platform uses 33 PostgreSQL tables organized into:

- **Users & Organization** - profiles, companies, groups
- **Course Content** - courses, modules, lessons, quizzes
- **Progress Tracking** - user progress, quiz attempts
- **Billing** - payments, subscriptions
- **Notifications** - email queue, reminders

See `docs/lms_schema.sql` for the complete schema.

## User Roles

| Role | Description |
|------|-------------|
| **Super Admin** | Platform owner - creates courses, manages companies |
| **Company Admin** | Client administrator - manages team, assigns courses |
| **User** | Learner - completes courses, views progress |

## Development Phases

### Phase 1: Web Platform (16 weeks)
- Foundation and authentication
- Super Admin functionality
- Company Admin functionality
- AI Course Builder
- Learning experience
- Payments integration

### Phase 2: Mobile App (6 weeks)
- Expo mobile application
- Offline learning support
- Push notifications

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset database

# Testing
npm run test             # Run tests
npm run test:e2e         # Run E2E tests

# Linting
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Type checking
npm run typecheck        # Run TypeScript checks
```

## Deployment

### Web (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy

### Supabase

1. Create production project
2. Run migrations
3. Deploy Edge Functions
4. Configure storage buckets

### Mobile (Phase 2)

1. Configure EAS Build
2. Submit to App Store / Play Store

## Documentation

- `docs/BRANDING.md` - Brand guidelines and design system
- `docs/lms_schema.sql` - Database schema
- `docs/lms_schema_summary.md` - Schema overview
- `docs/.env.example` - Environment variables template
- `docs/tailwind.config.js` - Tailwind configuration

## Contributing

1. Create a feature branch from `main`
2. Make changes
3. Submit pull request
4. Request review

## License

Proprietary - Sales Master Consultants

## Support

For support, contact info@salesmasterjm.com
