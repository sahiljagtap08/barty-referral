import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { 
        href: "/dashboard/referrals", 
        icon: "arrowRight", 
        title: "Referral Tracker" 
      },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Plans & Quota",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/voice-search",
        icon: "mic",
        title: "Voice Search",
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { 
        href: "https://discord.gg/barty", 
        icon: "messages", 
        title: "Discord Community" 
      },
      {
        href: "mailto:support@barty.com",
        icon: "help",
        title: "Help",
      },
    ],
  },
];
