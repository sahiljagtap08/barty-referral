# 🚀 Barty - One-Click Referrals

Barty helps job-seekers land referrals with **one click** by finding recruiter emails, auto-generating tailored messages, and following up—so they get hired faster without cold applying.

## 📋 Project Overview

Barty is a Next.js application that streamlines the job referral process through automation and AI. It allows users to upload their resume, paste a job link, and automatically generate personalized outreach emails to recruiters. The system tracks referral progress and manages email quotas.

## ✨ Core Features

- **Resume Upload**: Parse user resumes to extract relevant skills and experience
- **Job Link Parsing**: Extract job details and find recruiter emails
- **Personalized Email Generation**: AI-powered email generation with tone adjustment
- **Auto Follow-ups**: Automatic follow-up emails sent from user's own inbox
- **Referral Tracking**: Track the status of outreach efforts
- **Subscription Plans**: Tiered plans with different email quotas

## 🧩 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Email**: Resend API
- **AI**: GPT-4o for copy generation
- **Email Discovery**: RocketReach/Clearbit APIs
- **Authentication**: NextAuth.js
- **Payments**: Stripe

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- Stripe account
- Resend API key
- OpenAI API key
- Email discovery API (RocketReach/Clearbit)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Authentication
AUTH_SECRET=your_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_OAUTH_TOKEN=your_github_oauth_token

# Database
DATABASE_URL=your_supabase_postgres_url

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your@email.com

# Stripe
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=your_monthly_plan_id
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=your_yearly_plan_id
NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID=your_business_monthly_plan_id
NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID=your_business_yearly_plan_id

# App config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI
OPENAI_API_KEY=your_openai_api_key

# Email Discovery
EMAIL_DISCOVERY_API_KEY=your_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📁 Project Structure

- `/app`: Next.js app router components and routes
  - `/(auth)`: Authentication pages (login/register)
  - `/(marketing)`: Marketing pages (landing, pricing)
  - `/(protected)`: Auth-protected pages (dashboard, settings)
  - `/api`: API endpoints
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/config`: Application configuration
- `/hooks`: Custom React hooks
- `/types`: TypeScript type definitions
- `/emails`: Email templates
- `/public`: Static assets

## 🚶 Project Roadmap & MVP

### Current MVP Scope
- Marketing website with pricing page
- Basic app with resume upload and job link parsing
- Email generation and sending
- Quota tracking
- Basic referral status tracking

### Future Enhancements
- Referral outcome webhook from ATS (Greenhouse, Lever)
- Visa-friendly recruiter tag
- Mobile PWA with 1-tap follow-ups
- Referral leaderboard ("Wall of Wins")

## 🧠 Development Principles

1. **User-focused**: Every feature should reduce friction in the job referral process
2. **Performance**: Fast load times and responsive UI
3. **Security**: Protect user data and ensure email sending compliance
4. **Scalability**: Design systems that can scale with user growth

## 🔄 Changelog

### v0.1.0 (MVP)
- Transformed the SaaS starter template into Barty:
  - Updated site name, description, and branding
  - Revised pricing tiers to Starter, Growth, and Pro with email quotas
  - Removed blog and documentation sections
  - Created new landing page content with "One click. Warm intro." messaging
  - Updated marketing content (testimonials, features, benefits)
  - Designed dashboard UI with resume upload and job link input
  - Added referral tracking kanban board
  - Created settings page with email connection and configuration options 
  - Updated sidebar navigation with Barty-specific menu items
  - Updated README documentation

### Implementation Notes for Future Developers
- The resume parsing functionality will require integration with a PDF parsing library
- Email discovery APIs (RocketReach/Clearbit) need to be implemented in the backend
- OAuth integration with Gmail and Outlook is needed for sending emails
- Database schema will need to be updated to track referral status
- OpenAI integration is required for the email generation feature

## 📝 License

This project is proprietary and confidential.

---

Made with ☕ in Washington D.C. by "Grownups"
