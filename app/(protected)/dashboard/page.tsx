// Server component
import { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generate personalized referral emails in seconds",
};

export default function Dashboard() {
  return <DashboardClient />;
}
