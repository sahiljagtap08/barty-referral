import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdvancedSettings } from "@/components/dashboard/advanced-settings";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Icons } from "@/components/shared/icons";

// Demo user data
const DEMO_USER = {
  id: "demo-user-id",
  name: "Demo User",
  email: "demo@example.com",
  role: "USER"
};

export const metadata = constructMetadata({
  title: "Settings – Barty",
  description: "Configure your account and email settings.",
});

export default async function SettingsPage() {
  // Use demo user instead of auth
  const user = DEMO_USER;

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage your account and email settings."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Accounts</CardTitle>
            <CardDescription>
              Connect your email accounts to send emails from your own address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <Icons.google className="size-6" />
                <div>
                  <p className="font-medium">Google Gmail</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <Icons.messages className="size-6" />
                <div>
                  <p className="font-medium">Microsoft Outlook</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Signature</CardTitle>
            <CardDescription>
              Customize your email signature for all outgoing emails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Your custom email signature" 
              className="min-h-[120px]"
              defaultValue={`Best regards,\n${user.name}\n`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Preferences</CardTitle>
            <CardDescription>
              Configure how your emails are sent and followed up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-followup" className="flex flex-col space-y-1">
                <span>Auto Follow-ups</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Automatically send follow-up emails if no response
                </span>
              </Label>
              <Switch id="auto-followup" defaultChecked />
            </div>

            <div className="space-y-3">
              <Label htmlFor="daily-limit">
                <span>Daily Send Limit</span>
                <span className="ml-2 text-sm text-muted-foreground">(10 emails)</span>
              </Label>
              <Slider
                id="daily-limit"
                defaultValue={[10]}
                max={40}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Control how many emails are sent per day to maintain deliverability.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <AdvancedSettings />

        <div className="divide-y divide-muted">
          <UserNameForm user={{ id: user.id, name: user.name || "" }} />
          <DeleteAccountSection />
        </div>
      </div>
    </>
  );
}
