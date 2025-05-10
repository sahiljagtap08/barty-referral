"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

// Demo user data
const DEMO_USER = {
  id: "demo-user-id",
  email: "demo@example.com",
  name: "Demo User",
};

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard/billing");

export async function openCustomerPortal(
  userStripeId: string,
): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    // Use demo user instead of auth
    const user = DEMO_USER;
    
    console.log(`Demo mode: Opening customer portal for Stripe ID: ${userStripeId}`);

    if (userStripeId) {
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: userStripeId,
          return_url: billingUrl,
        });
        
        redirectUrl = stripeSession.url as string;
      } catch (stripeError) {
        console.log("Demo mode: Stripe error or invalid customer ID, redirecting to billing page");
        // In demo mode, we'll just redirect to the billing page if there's an error
        redirectUrl = billingUrl;
      }
    } else {
      // If no Stripe ID provided, just redirect to billing page
      redirectUrl = billingUrl;
    }
  } catch (error) {
    console.error("Error in openCustomerPortal:", error);
    redirectUrl = billingUrl;
  }

  redirect(redirectUrl);
}
