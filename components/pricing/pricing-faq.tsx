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
      "Yes! When you choose yearly billing, you'll save approximately 20% compared to monthly billing. The Starter plan is just $3.99/month (billed annually at $47.88), the Growth plan is $15.99/month (billed annually at $191.88), and the Pro plan is $79.99/month (billed annually at $959.88).",
  },
  {
    id: "item-5",
    question: "Is there a free trial available?",
    answer:
      "Yes, all new users get 20 free referral emails to test our platform before subscribing to a paid plan. This lets you experience the value of our service risk-free before committing to a subscription.",
  },
  {
    id: "item-6",
    question: "How does Barty personalize emails for referrals?",
    answer:
      "Barty uses advanced AI to generate highly personalized emails based on your resume, the job description, and the recipient's profile. Our system analyzes your skills and experience to highlight relevant qualifications, adapts to different company cultures, and creates natural, conversational outreach that stands out from generic templates.",
  },
  {
    id: "item-7",
    question: "How does Barty find contacts at companies?",
    answer:
      "We use a multi-tiered approach to find relevant contacts. First, we check our database for cached contacts. If none are found, we use trusted data providers like Clearbit and People Data Labs to locate real recruiters and employees at your target companies. When necessary, we can also generate realistic mock contacts to demonstrate the functionality.",
  },
  {
    id: "item-8",
    question: "Can I integrate Barty with my email service?",
    answer:
      "Yes, Barty integrates with popular email services like Gmail and Outlook. This allows you to send referral requests directly from your own email address, which typically results in higher response rates. Our system can track opens and responses while maintaining the natural feel of personal correspondence.",
  },
  {
    id: "item-9",
    question: "Are there limits to how many emails I can send?",
    answer:
      "Yes, each plan has specific email limits to ensure responsible usage. The Starter plan includes 50 recruiter emails per month, the Growth plan offers 200, and the Pro plan provides 1,000. These limits help maintain deliverability rates and prevent potential email service throttling.",
  },
  {
    id: "item-10",
    question: "How does Barty keep my data secure?",
    answer:
      "We take data security seriously. Your resume and personal information are encrypted at rest and in transit. We never share your data with third parties without your consent. Our contact finding services use secure API connections with industry-standard authentication, and we regularly audit our systems to maintain the highest security standards.",
  },
  {
    id: "item-11",
    question: "What is the cancellation policy?",
    answer:
      "You can cancel your subscription at any time through your account settings. If you cancel, you'll retain access to your plan until the end of your current billing period. We don't offer refunds for partial months, but you're welcome to use the service until your subscription expires. After cancellation, your account will revert to limited functionality.",
  },
];

export function PricingFaq() {
  return (
    <section id="faq" className="container max-w-4xl py-2">
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
