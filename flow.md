understand the complete flow of the Barty application. Here's the documented flow structure:

## Barty Application Flow

### Authentication & Onboarding
1. **Sign up** using Supabase auth + Google auth
2. **Onboarding process**:
   - Name and basic information
   - Social profiles (LinkedIn, Twitter, GitHub) - optional
   - Resume upload (can be changed later)

### Main Dashboard
- **Layout**: Sidebar navigation with main content area
- **Dashboard homepage** shows:
  - Analytics of user activity
  - Recent activity log
  - Dynamically generated list of recommended people:
    - Recruiters at target companies
    - Employees for potential referrals
  - One-click email outreach option for each contact
  - "Find referrals with voice search" button

### Sidebar Navigation
- **Menu Section**:
  - Dashboard (home)
  - Referral Tracker
  - Voice Search
  - Plans & Quota
- **Options Section**:
  - Settings
  - Help

### Key Features

#### Referral Tracker
- Kanban-style interface
- Follow-up buttons for both referrals and recruiters
- Track status of outreach efforts

#### Voice Search (Unique Value Proposition)
- Multi-modal search (voice or text input)
- Natural language query processing:
  - "I'm looking for someone at a SF-based startup who is a SWE and can refer me"
  - "Looking for SWE at Google in Seattle office"
  - "Recruiter from DoorDash"
- Shows matching contacts with:
  - Generate Email button
  - Send button
- Personalized email generation based on:
  - Referrer's profile context
  - User's profile/resume
  - Uses OpenAI LLM
- Email tone customization (friendly, neutral, formal)
- Email verification through SMTP ping
- Sends directly from user's connected email (Gmail/Outlook)

#### Plans & Quota
- Manage/change subscription plans
- Track usage against quota limits

#### Settings
- Email integration (Gmail or Outlook)
- Email signature customization
- Auto-follow ups toggle (on/off)
- Daily email sending limits
- Follow-up email configuration
- Advanced settings
- Account details (name, email)
- Account management (password change, account deletion)

#### Help Section
- Support email contact
- FAQs reference

### Profile Management
- Accessible via icon in top-right corner
- Options:
  - View/edit profile
  - Logout
- Profile page shows:
  - All onboarding information
  - Resume (with ability to update)
  - Email and name
  - Current plan details
- Pro user badge appears on profile icon for premium subscribers

This comprehensive flow covers the user journey from signup through the core functionality of generating personalized outreach for job referrals, with special emphasis on the voice search feature as the main value proposition.


