import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "How Barty Works",
    description:
      "Land internal referrals with AI-powered emails sent straight from your own inbox. Stop cold applying. Start getting replies.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Upload your résumé",
        description: "Drop in your résumé—Barty scans your experience instantly.",
        icon: "media",
      },
      {
        title: "Paste the job link",
        description: "We fetch the recruiter's & employees at your company of choice verified email & job keywords.",
        icon: "search",
      },
      {
        title: "Click 'Send'",
        description: "Barty generates a custom email & auto-follows up. All from your own Gmail or Outlook.",
        icon: "arrowRight",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Tailored, not spammy",
    description: "Your resume and the job description get fused into 1:1 messaging.",
    link: "/dashboard/referrals",
    icon: "messages",
  },
  {
    title: "Replies land in your inbox",
    description: "Messages are sent from you, not a weird no-reply bot.",
    icon: "messages",
    link: "/dashboard/settings",
  },
  {
    title: "Follow-ups auto-scheduled",
    description: "We ping recruiters twice (nicely!) if they don't respond.",
    link: "/dashboard/referrals",
    icon: "lineChart",
  },
  {
    title: "Track your referrals",
    description: "Get live status when someone refers you or replies.",
    link: "/dashboard/referrals",
    icon: "lineChart",
  },
  {
    title: "Resume analysis & tuning",
    description: "Get instant feedback on how your resume matches each job to maximize referral chances.",
    link: "/dashboard",
    icon: "search",
  },
  {
    title: "One-click outreach",
    description: "Reach multiple potential referrers at your target company with personalized messages.",
    link: "/dashboard/referrals",
    icon: "arrowRight",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "James Chen",
    job: "Software Engineer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review: "I got referred to Amazon L4 in 5 days—didn't DM anyone. Barty's personalized emails got me 3 replies from team leads!",
  },
  {
    name: "Priya Sharma",
    job: "Product Manager",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review: "Recruiters responded in under 24 hours. Barty actually works. I didn't have to spend hours crafting emails or following up.",
  },
  {
    name: "Marcus Johnson",
    job: "UX Designer",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review: "Best $4.99 I ever spent. I got 3 callbacks from FAANG companies in a week. The auto follow-ups are a game-changer.",
  },
  {
    name: "Sarah Rodriguez",
    job: "Data Scientist",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review: "As an international candidate, I struggled with networking. Barty got me 7 referrals at visa-sponsoring companies. Worth every penny!",
  },
  {
    name: "Alex Turner",
    job: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review: "The job market is brutal right now, but Barty helped me land interviews at 5 different companies in two weeks. The personalized outreach made all the difference.",
  },
  {
    name: "Emma Wilson",
    job: "Growth Marketer",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    review: "I was skeptical at first, but Barty's email templates are genuinely impressive. I got a referral at my dream company after just 3 emails!",
  },
];
