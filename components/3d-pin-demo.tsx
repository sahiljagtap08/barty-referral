"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the PinContainer component with no SSR
const PinContainer = dynamic(
  () => import("@/components/ui/3d-pin").then((mod) => mod.PinContainer),
  { ssr: false }
);

export default function AnimatedPinDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center -mt-20">
      <Suspense fallback={<div className="w-[40rem] h-[40rem] bg-black/20 rounded-2xl animate-pulse" />}>
        <PinContainer
          title="Referral Request Email"
          href="#"
          containerClassName="scale-150"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 w-[24rem] h-[24rem] overflow-y-auto">
            <div className="text-xs text-slate-400 mb-2">
              <div>From: chris.tucker@gmail.com</div>
              <div>To: sarah@amazon.com</div>
              <div>Subject: Referral Request for Software Engineer Position (Job ID: 12345)</div>
            </div>
            
            <div className="border-t border-slate-700 my-2"></div>
            
            <h3 className="!pb-2 !m-0 font-semibold text-base text-slate-100">
              Hello Sarah,
            </h3>
            
            <div className="text-sm !m-0 !p-0 text-slate-300 space-y-2">
              <p>I hope this email finds you well. We briefly connected at the Tech Conference last month where you shared some insights about your work at Amazon.</p>
              
              <p>I'm reaching out because I'm very interested in the Software Engineer position (Job ID: 12345) at Amazon. My background in full-stack development and experience with similar technologies used at Amazon makes me believe I could be a great fit.</p>
              
              <p>Would you be willing to refer me for this position? I've attached my resume and would be happy to provide any additional information you might need.</p>
              
              <p>I understand you're busy, so even a quick response would be greatly appreciated.</p>
              
              <p>Thank you for your consideration!</p>
              
              <p>Best regards,<br/>Chris Tucker<br/>555-123-4567</p>
              
              <div className="bg-indigo-600/30 p-2 rounded-md text-xs text-slate-200 mt-3">
                <span className="font-medium">📎 Resume.pdf attached (2.4MB)</span>
              </div>
            </div>
          </div>
        </PinContainer>
      </Suspense>
    </div>
  );
} 