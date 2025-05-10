"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, 
  MapPin, 
  Mail, 
  Linkedin, 
  Send, 
  FileText, 
  Check, 
  Upload 
} from "lucide-react";
import { toast } from "sonner";
import { LinkedInProfile } from "@/lib/linkedin-scraper";

interface ProfileCardProps {
  profile: LinkedInProfile;
  email?: string;
  onSendReferralRequest: (profileId: string, customMessage?: string) => Promise<void>;
  onSaveContact?: (profileId: string) => Promise<void>;
}

export function ProfileCard({
  profile,
  email,
  onSendReferralRequest,
  onSaveContact,
}: ProfileCardProps) {
  const [customMessage, setCustomMessage] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await onSendReferralRequest(profile.name, customMessage);
      setIsEmailDialogOpen(false);
      toast.success(`Referral request sent to ${profile.name}`);
    } catch (error) {
      toast.error("Failed to send referral request. Please try again.");
      console.error("Error sending referral request:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSaveContact = async () => {
    if (!onSaveContact) return;
    
    try {
      await onSaveContact(profile.name);
      setIsSaved(true);
      toast.success(`${profile.name} saved to your contacts`);
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
      console.error("Error saving contact:", error);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.headline || profile.position}</p>
            </div>
            
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{profile.company}</span>
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs md:text-sm truncate">{email}</span>
                </div>
              )}
            </div>
            
            {profile.experience && profile.experience.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Experience</p>
                <div className="flex flex-wrap gap-1">
                  {profile.experience.slice(0, 2).map((exp, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {exp.title} at {exp.company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-muted/30 px-6 py-4">
        <div className="flex gap-2">
          {profile.company && (
            <Link 
              href={`https://www.linkedin.com/company/${profile.company.toLowerCase().replace(/\s+/g, "-")}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4 mr-1" />
                Company
              </Button>
            </Link>
          )}
          
          {onSaveContact && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveContact}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> Saved
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1" /> Save
                </>
              )}
            </Button>
          )}
        </div>
        
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Send className="h-4 w-4 mr-1" /> Send Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Referral Request</DialogTitle>
              <DialogDescription>
                We'll automatically generate a personalized email to request a referral from {profile.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} />
                  <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground">{profile.position || profile.headline} at {profile.company}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Add a personalized message (optional)</p>
                <Textarea
                  placeholder="e.g., I noticed you've been at Company X for 3 years and I'd love to learn more about your experience..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>Your resume will be attached automatically</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isSending}>
                {isSending ? "Sending..." : "Send Referral Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 