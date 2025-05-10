import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";

// Demo user data
const DEMO_USER = {
  id: "demo-user-id",
  role: "USER",
  email: "demo@example.com"
};

export const metadata = constructMetadata({
  title: "Billing – SaaS Starter",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  // Use demo user data
  const user = DEMO_USER;

  // Get subscription plan for demo user
  let userSubscriptionPlan;
  try {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } catch (error) {
    console.log("Using demo subscription plan");
    // Fallback to demo subscription plan if needed
    userSubscriptionPlan = {
      isPaid: false,
      name: "Free",
      description: "Demo Plan",
      stripePriceId: "",
      stripeCurrentPeriodEnd: null,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
    };
  }

  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            SaaS Starter app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
