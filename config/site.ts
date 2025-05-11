import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Barty",
  description:
    "Land internal referrals with AI-powered emails sent straight from your own inbox. Stop cold applying. Start getting replies. Barty helps job-seekers land referrals with one click by finding recruiter emails, auto-generating tailored messages, and following up.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/company/barty-ai",
  },
  mailSupport: "support@trybarty.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Discord", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Features", href: "/#features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Testimonials", href: "/#testimonials" },
      { title: "FAQ", href: "/pricing#faq" },
    ],
  },
];
