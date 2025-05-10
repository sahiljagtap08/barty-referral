"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/referrals/status-indicator";

// Types for our referrals
type ReferralStatus = "requested" | "opened" | "replied" | "referred";

interface Referral {
  id: string;
  jobTitle: string;
  company: string;
  status: ReferralStatus;
  timeAgo: string;
  recruiter?: string;
  followUps?: number;
}

// Mock data for the referrals
const referrals: Referral[] = [
  {
    id: "1",
    jobTitle: "Frontend Engineer",
    company: "Airbnb",
    status: "requested",
    timeAgo: "2 days ago",
  },
  {
    id: "2",
    jobTitle: "UX Designer",
    company: "Meta",
    status: "opened",
    timeAgo: "5 hours ago",
    recruiter: "Sarah Johnson",
  },
  {
    id: "3",
    jobTitle: "Data Scientist",
    company: "Amazon",
    status: "replied",
    timeAgo: "3 days ago",
    recruiter: "Emma Williams",
    followUps: 1,
  },
  {
    id: "4",
    jobTitle: "Backend Engineer",
    company: "Stripe",
    status: "referred",
    timeAgo: "2 days ago",
    recruiter: "James Rodriguez",
    followUps: 2,
  },
  {
    id: "5",
    jobTitle: "Product Manager",
    company: "Google",
    status: "requested",
    timeAgo: "1 day ago",
  },
  {
    id: "6",
    jobTitle: "Software Engineer",
    company: "Netflix",
    status: "opened",
    timeAgo: "1 day ago",
    recruiter: "Michael Chen",
    followUps: 1,
  },
];

export function ReferralTracker() {
  // Group referrals by status
  const requestedReferrals = referrals.filter(ref => ref.status === "requested");
  const openedReferrals = referrals.filter(ref => ref.status === "opened");
  const repliedReferrals = referrals.filter(ref => ref.status === "replied");
  const referredReferrals = referrals.filter(ref => ref.status === "referred");

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Referral Tracker</h2>
        <Button>Add Referral</Button>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {/* Requested Column */}
        <ReferralStatusColumn 
          status="requested" 
          referrals={requestedReferrals} 
          count={requestedReferrals.length}
        />
        
        {/* Opened Column */}
        <ReferralStatusColumn 
          status="opened" 
          referrals={openedReferrals} 
          count={openedReferrals.length}
        />
        
        {/* Replied Column */}
        <ReferralStatusColumn 
          status="replied" 
          referrals={repliedReferrals} 
          count={repliedReferrals.length}
        />
        
        {/* Referred Column */}
        <ReferralStatusColumn 
          status="referred" 
          referrals={referredReferrals} 
          count={referredReferrals.length}
        />
      </div>
    </div>
  );
}

interface ReferralStatusColumnProps {
  status: ReferralStatus;
  referrals: Referral[];
  count: number;
}

function ReferralStatusColumn({ status, referrals, count }: ReferralStatusColumnProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StatusIndicator status={status} />
        <span className="ml-auto text-muted-foreground font-medium">{count}</span>
      </div>
      
      {referrals.map((referral) => (
        <ReferralCard key={referral.id} referral={referral} />
      ))}
    </div>
  );
}

interface ReferralCardProps {
  referral: Referral;
}

function ReferralCard({ referral }: ReferralCardProps) {
  return (
    <Card className="relative">
      <CardContent className="p-4 space-y-4">
        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Send follow-up</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Job Info */}
        <div className="space-y-1 pt-2">
          <h3 className="font-semibold">{referral.jobTitle}</h3>
          <p className="text-sm text-muted-foreground">{referral.company}</p>
        </div>
        
        {/* Recruiter Info (if available) */}
        {referral.recruiter && (
          <div className="text-sm">
            <p className="text-muted-foreground">Recruiter: {referral.recruiter}</p>
          </div>
        )}
        
        {/* Time and Follow-up Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{referral.timeAgo}</span>
          {referral.followUps && (
            <span className="text-xs text-muted-foreground">
              {referral.followUps} follow-up{referral.followUps > 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
        >
          {referral.status === "replied" ? "Send Thank You" : "Follow Up"}
        </Button>
      </CardContent>
    </Card>
  );
} 