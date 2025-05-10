"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sliders } from "lucide-react";
import { toast } from "sonner";

export function AdvancedSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [trackEmails, setTrackEmails] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would save to database here
      // await saveUserPreferences({ emailNotifications, trackEmails, browserNotifications });
      
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sliders className="h-5 w-5" />
          <CardTitle>Advanced Settings</CardTitle>
        </div>
        <CardDescription>
          Additional configuration and preferences.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1 cursor-pointer">
            <span>Receive email notifications about referral status changes</span>
          </Label>
          <Switch 
            id="email-notifications" 
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="track-emails" className="flex flex-col space-y-1 cursor-pointer">
            <span>Track email opens and responses</span>
          </Label>
          <Switch 
            id="track-emails" 
            checked={trackEmails}
            onCheckedChange={setTrackEmails}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="browser-notifications" className="flex flex-col space-y-1 cursor-pointer">
            <span>Enable browser notifications</span>
          </Label>
          <Switch 
            id="browser-notifications" 
            checked={browserNotifications}
            onCheckedChange={setBrowserNotifications}
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSavePreferences} 
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
} 