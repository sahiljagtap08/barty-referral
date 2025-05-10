"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUpload } from "@/components/shared/resume-upload";
import { JobLinkParser } from "@/components/shared/job-link-parser";
import { ReferralEmailGenerator } from "@/components/shared/referral-email-generator";
import { Icons } from "@/components/shared/icons";
import { StatusIndicator } from "@/components/referrals/status-indicator";

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<string>("email-wizard");
  
  return (
    <div className="container py-6 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <Tabs defaultValue="email-wizard" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="email-wizard" className="flex items-center gap-2">
            <Icons.mail className="h-4 w-4" />
            Email Wizard
          </TabsTrigger>
          <TabsTrigger value="recent-activity" className="flex items-center gap-2">
            <Icons.activity className="h-4 w-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Icons.barChart className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email-wizard" className="space-y-4">
          <ReferralEmailGenerator />
        </TabsContent>
        
        <TabsContent value="recent-activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Track your referral requests and responses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 font-medium border-b p-4">
                <div>Job</div>
                <div>Company</div>
                <div>Status</div>
                <div>Date</div>
                <div>Actions</div>
              </div>
              
              <div className="divide-y">
                <div className="grid grid-cols-5 items-center p-4">
                  <div>
                    <span className="font-medium">Senior Frontend Engineer</span>
                  </div>
                  <div>Airbnb</div>
                  <div>
                    <StatusIndicator status="sent" />
                  </div>
                  <div>2h ago</div>
                  <div>
                    <Button variant="outline" size="sm">Follow up</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 items-center p-4">
                  <div>
                    <span className="font-medium">Product Manager</span>
                  </div>
                  <div>Google</div>
                  <div>
                    <StatusIndicator status="opened" />
                  </div>
                  <div>5h ago</div>
                  <div>
                    <Button variant="outline" size="sm">Follow up</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 items-center p-4">
                  <div>
                    <span className="font-medium">UX Designer</span>
                  </div>
                  <div>Stripe</div>
                  <div>
                    <StatusIndicator status="replied" />
                  </div>
                  <div>1d ago</div>
                  <div>
                    <Button variant="outline" size="sm">Follow up</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 items-center p-4">
                  <div>
                    <span className="font-medium">Software Engineer</span>
                  </div>
                  <div>Meta</div>
                  <div>
                    <StatusIndicator status="referred" />
                  </div>
                  <div>2d ago</div>
                  <div>
                    <Button variant="outline" size="sm">Follow up</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Stats</CardTitle>
              <CardDescription>Track the performance of your referral requests</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-sm text-muted-foreground">Emails Sent</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-3xl font-bold">8</span>
                      <span className="text-sm text-muted-foreground">Opened</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-3xl font-bold">5</span>
                      <span className="text-sm text-muted-foreground">Replies</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-3xl font-bold">3</span>
                      <span className="text-sm text-muted-foreground">Referrals</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-bold">Starter Plan</h4>
                      <p className="text-muted-foreground">12 emails remaining</p>
                    </div>
                    <Button>Upgrade</Button>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "24%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">12/50 emails used this month</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 