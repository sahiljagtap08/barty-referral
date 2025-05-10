import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "How does Barty's referral platform work?",
    answer:
      "Barty connects job seekers with employees at their target companies. Our platform helps you craft personalized outreach emails, automatically follows up, and tracks your referral requests. Once you sign up, you can start sending referral requests to recruiters and employees at companies you're interested in.",
  },
  {
    id: "item-2",
    question: "What's included in the Starter plan?",
    answer:
      "The Starter plan includes 50 recruiter emails per month, 2 automatic follow-ups per job, basic resume parsing, personalized outreach templates, and basic tracking analytics. It's perfect for candidates focused on a targeted job search.",
  },
  {
    id: "item-3",
    question: "What additional features are in the Pro plan?",
    answer:
      "The Pro plan includes everything in the Starter and Growth plans, plus 1,000 recruiter emails per month, 3 automatic follow-ups per job, advanced resume parsing with skill matching, fully customizable outreach with tone & style controls, comprehensive tracking analytics, 24-hour priority support, custom email signatures, and visa-friendly recruiter matching.",
  },
  {
    id: "item-4",
    question: "Do you offer discounts for annual subscriptions?",
    answer:
      "Yes! When you choose yearly billing, you'll save approximately 20% compared to monthly billing. The Starter plan is just $3.99/month (billed annually at $47.88), the Growth plan is $15.99/month (billed annually at $191.88), and the Pro plan is $39.99/month (billed annually at $479.88).",
  },
  {
    id: "item-5",
    question: "Is there a free trial available?",
    answer:
      "Yes, all new users get 20 free referral emails to test our platform before subscribing to a paid plan. This lets you experience the value of our service risk-free before committing to a subscription.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
