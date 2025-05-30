import Image from "next/image";
import Link from "next/link";

import { UserSubscriptionPlan } from "@/types";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – SaaS Starter",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  // Demo data
  const userId = "demo-user-id";
  const subscriptionPlan: UserSubscriptionPlan | undefined = undefined;
  
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards userId={userId} subscriptionPlan={subscriptionPlan} />
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
