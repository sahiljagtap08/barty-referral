import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Great for a focused job hunt",
    benefits: [
      "50 recruiter emails per month",
      "Auto follow-ups (2x per job)",
      "Resume parser",
      "Personalized outreach",
      "Basic tracking & analytics",
    ],
    limitations: [
      "No priority support",
      "Standard templates only",
    ],
    prices: {
      monthly: 4.99,
      yearly: 49.99,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Growth",
    description: "Apply broadly and follow up",
    benefits: [
      "200 recruiter emails per month",
      "Auto follow-ups (2x per job)",
      "Resume parser with keyword matching",
      "Personalized outreach with tone control",
      "Advanced tracking & analytics",
      "Priority support",
    ],
    limitations: [
      "Standard & advanced templates only",
    ],
    prices: {
      monthly: 19.99,
      yearly: 199.99,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
  },
  {
    title: "Pro",
    description: "Full blast job search mode",
    benefits: [
      "1,000 recruiter emails per month",
      "Auto follow-ups (3x per job)",
      "Advanced resume parser with skill matching",
      "Fully customizable outreach with tone & style",
      "Comprehensive tracking & analytics",
      "Priority support with 24-hour response",
      "Custom email signature",
      "Visa-friendly recruiter matching",
    ],
    limitations: [],
    prices: {
      monthly: 99.99,
      yearly: 999.99,
    },
    stripeIds: {
      monthly: null, // Need to create new stripe product
      yearly: null, // Need to create new stripe product
    },
  },
];

export const plansColumns = [
  "starter",
  "growth",
  "pro",
] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "Monthly Email Quota",
    starter: "50",
    growth: "200",
    pro: "1,000",
    tooltip: "Number of recruiter emails you can send per month",
  },
  {
    feature: "Auto Follow-ups",
    starter: "2x",
    growth: "2x",
    pro: "3x",
    tooltip: "Automatic follow-up emails sent if no response",
  },
  {
    feature: "Resume Parsing",
    starter: "Basic",
    growth: "Advanced",
    pro: "Premium",
    tooltip: "AI-powered resume analysis to match with job descriptions",
  },
  {
    feature: "Email Customization",
    starter: "Basic",
    growth: "Advanced",
    pro: "Full Control",
    tooltip: "Ability to customize outreach emails",
  },
  {
    feature: "Referral Tracking",
    starter: "Basic",
    growth: "Advanced",
    pro: "Comprehensive",
    tooltip: "Track the status of your referral requests",
  },
  {
    feature: "Customer Support",
    starter: "Email",
    growth: "Priority Email",
    pro: "Priority (24h response)",
    tooltip: "Support response times and channels",
  },
  {
    feature: "Email Signature",
    starter: "Standard",
    growth: "Standard",
    pro: "Custom",
    tooltip: "Customize your email signature",
  },
  {
    feature: "Visa-friendly Filtering",
    starter: null,
    growth: null,
    pro: true,
    tooltip: "Filter for recruiters who work with visa candidates",
  },
  {
    feature: "Daily Send Limit",
    starter: "10",
    growth: "20",
    pro: "40",
    tooltip: "Maximum number of emails you can send per day",
  },
  {
    feature: "Free Trial",
    starter: "20 emails",
    growth: "20 emails",
    pro: "20 emails",
    tooltip: "Start with 20 free emails before subscribing",
  },
];
