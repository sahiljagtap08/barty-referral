import { Metadata } from "next";
import { ReferralEmailGenerator } from "@/components/shared/referral-email-generator";
import { ReferralTracker } from "@/components/referrals/referral-tracker";

export const metadata = {
  title: "Referral Tracker",
  description: "Track the status of your referral requests",
};

export default function ReferralsPage() {
  return <ReferralTracker />;
} 