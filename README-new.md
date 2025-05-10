# Barty - The Referral Platform

Barty is a professional referral platform designed to help job seekers connect with employees at target companies, send personalized outreach emails, and track their referral requests.

## Features

- **AI-Powered Search**: Find employees at specific companies with job roles matching your criteria
- **Voice Search**: Use voice commands to search for potential referrers
- **Email Finder**: Automatically finds and verifies email addresses for contacts
- **AI-Generated Personalized Emails**: Create custom-tailored outreach messages based on both recipient and sender profiles
- **Email Tracking**: Track when your emails are opened, clicked, and replied to
- **Auto Follow-Ups**: Schedule automatic follow-up emails for unanswered requests
- **Resume Attachment**: Automatically attach your resume to referral requests
- **Email Integration**: Connect with Gmail, Outlook, or other email providers
- **Referral Analytics**: Track your outreach performance and success rates

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: NextAuth.js with Supabase Auth
- **AI/ML**: OpenAI GPT APIs for personalized content generation
- **Email**: Resend for email delivery and tracking
- **Voice Processing**: ElevenLabs for speech-to-text and text-to-speech
- **Storage**: Supabase Storage for resume files

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (for database and auth)
- OpenAI API key
- Resend API key
- ElevenLabs API key (optional, for voice features)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/barty-referral.git
   cd barty-referral
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file with your environment variables (see `.env.example` for reference)

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL from `schema.sql` in the Supabase SQL editor
   - Copy your Supabase URL and anon key to the .env file

5. Run the development server:
   ```
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The database schema is defined in `schema.sql`. It includes tables for:

- User profiles
- Referral contacts
- Emails
- Email accounts (for integration)
- Companies
- User settings
- Email events (tracking)
- Search history

## Application Structure

- `/app` - Next.js App Router structure
- `/components` - React components
- `/lib` - Utility functions and API clients
- `/public` - Static assets
- `/types` - TypeScript type definitions
- `/styles` - Global CSS styles
- `/actions` - Server actions
- `/hooks` - Custom React hooks

## Key Components

### Referral Search

The search functionality uses NLP to parse natural language queries like "Software Engineers at Google in Seattle" into structured parameters for the search.

### Email Generation

Emails are personalized using OpenAI's GPT models. The system analyzes both the recipient's profile and the sender's information to create relevant, conversion-optimized messages.

### Email Tracking

Tracking pixels and link tracking are used to monitor email opens and link clicks. Data is stored in Supabase for analytics.

## API Routes

- `/api/referrals/search` - Search for potential referrers
- `/api/referrals/send` - Send referral request emails
- `/api/email/track` - Track email opens
- `/api/user` - User profile management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Next.js](https://nextjs.org/) for the application framework
- [Supabase](https://supabase.io/) for database and authentication
- [OpenAI](https://openai.com/) for AI capabilities
- [ElevenLabs](https://elevenlabs.io/) for voice features
- [Resend](https://resend.com/) for email services 