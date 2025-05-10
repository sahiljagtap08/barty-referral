import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default async function HeroLanding() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
    {
      ...(env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      // data will revalidate every hour
      next: { revalidate: 3600 },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));

  return (
    <section className="relative space-y-6 py-24 sm:py-32 lg:py-36 min-h-[80vh] flex items-center justify-center">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center relative z-10">
        <Link
          href="/pricing"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4 bg-background/80 backdrop-blur-sm",
          )}
        >
          <span>Start with 20 free emails – no card required</span>
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px] flex flex-col md:flex-row md:items-center md:gap-3">
          <span className="text-gradient_indigo-purple font-extrabold">
            One click.
          </span>
          <ContainerTextFlip 
            words={["Warm Intro.", "Real Referral.", "Less Ghosting.", "Fast Response."]} 
            interval={3000}
            className="mt-2 md:mt-0 !bg-transparent !shadow-none text-foreground"
          />
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Land internal referrals with AI-powered emails sent straight from your own inbox. 
          Stop cold applying. Start getting replies.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Start Free (20 Emails)</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href="#demo"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5 bg-background/80 backdrop-blur-sm",
            )}
          >
            <Icons.media className="mr-2 size-4" />
            <p>Watch a 30-Second Demo</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
