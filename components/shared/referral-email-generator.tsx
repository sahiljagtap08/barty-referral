"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Send,
  FileText,
  Link,
  Loader2,
  Edit,
  Copy,
  ClipboardCopy,
  Briefcase,
  User,
  UserRound
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ResumeUpload } from "./resume-upload";
import { JobLinkParser } from "./job-link-parser";
import { ReferralContactSuggestions } from "./referral-contact-suggestions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface JobData {
  id?: string;
  title: string;
  company: string;
  company_name?: string;
  job_title?: string;
  location?: string;
  job_location?: string;
  description?: string;
  job_description?: string;
  recruiterEmail?: string;
  recruiter_email?: string;
  requiredSkills?: string[];
  job_skills?: string[];
  jobLink: string;
}

interface ResumeData {
  id?: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  public_url: string;
  parsed_content?: any;
}

interface ReferralEmailGeneratorProps {
  initialResumeData?: ResumeData;
  initialJobData?: JobData;
  className?: string;
}

export function ReferralEmailGenerator({
  initialResumeData,
  initialJobData,
  className = "",
}: ReferralEmailGeneratorProps) {
  // State for resume and job data
  const [resumeData, setResumeData] = useState<ResumeData | null>(initialResumeData || null);
  const [jobData, setJobData] = useState<JobData | null>(initialJobData || null);
  const [hasPreExistingResume, setHasPreExistingResume] = useState(false);
  
  // State for contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  
  // State for UI
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [tone, setTone] = useState(50);
  
  // Check for existing resume on mount
  useEffect(() => {
    const checkForExistingResume = async () => {
      try {
        const response = await fetch('/api/resume/latest');
        if (response.ok) {
          const data = await response.json();
          if (data.resume) {
            setResumeData(data.resume);
            setHasPreExistingResume(true);
          }
        }
      } catch (error) {
        console.error("Error checking for existing resume:", error);
      }
    };
    
    checkForExistingResume();
  }, []);
  
  // Set contact company from job data if available
  useEffect(() => {
    if (jobData?.company) {
      setContactCompany(jobData.company);
    }
  }, [jobData]);
  
  // Get tone text based on slider value
  const getToneText = () => {
    if (tone < 34) return "Friendly";
    if (tone < 67) return "Neutral";
    return "Formal";
  };
  
  // Handle resume upload success
  const handleResumeUploadSuccess = (data: any) => {
    setResumeData(data.resume);
  };
  
  // Handle job parsing success
  const handleJobParseSuccess = (data: JobData) => {
    setJobData(data);
  };
  
  // Generate email
  const generateEmail = async () => {
    // Validation
    if (!resumeData) {
      toast.error("Please upload your resume first");
      return;
    }
    
    if (!jobData) {
      toast.error("Please parse a job link first");
      return;
    }
    
    if (!contactName) {
      toast.error("Please enter the contact's name");
      return;
    }
    
    if (!contactEmail) {
      toast.error("Please enter the contact's email");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Call API to generate email
      const response = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: resumeData.id,
          jobId: jobData.id,
          recipientName: contactName,
          recipientEmail: contactEmail,
          company: contactCompany || jobData.company,
          jobTitle: jobData.title,
          customMessage,
          tone: getToneText().toLowerCase()
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate email");
      }
      
      // Set generated email
      setGeneratedEmail(data.emailContent);
      
      // Open email dialog
      setIsEmailDialogOpen(true);
      
      toast.success("Email generated successfully!");
      
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Send email
  const sendEmail = async () => {
    if (!generatedEmail || !contactEmail || !contactName) {
      toast.error("Missing required information for sending email");
      return;
    }
    
    try {
      // Call API to send email
      const response = await fetch('/api/referrals/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: contactName,
          recipientEmail: contactEmail,
          company: contactCompany || jobData?.company || "",
          jobTitle: jobData?.title || "",
          emailContent: generatedEmail,
          includeResume: true
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }
      
      // Close dialog
      setIsEmailDialogOpen(false);
      
      // Reset form
      setCustomMessage("");
      
      toast.success("Referral email sent successfully!");
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send email. Please try again.");
    }
  };
  
  // Copy email to clipboard
  const copyToClipboard = () => {
    if (!generatedEmail) return;
    
    navigator.clipboard.writeText(generatedEmail)
      .then(() => toast.success("Email copied to clipboard"))
      .catch(() => toast.error("Failed to copy email"));
  };
  
  return (
    <div className={`space-y-8 ${className}`}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Upload Resume
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center">
            <Link className="h-4 w-4 mr-2" />
            Job Details
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-4">
          {hasPreExistingResume && resumeData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Resume</CardTitle>
                <CardDescription>You already have a resume uploaded</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-medium mb-2">{resumeData.file_name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resumeData.file_size ? `${(resumeData.file_size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(resumeData.public_url, '_blank', 'noopener,noreferrer')}
                    >
                      View Resume
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => setHasPreExistingResume(false)}
                    >
                      Upload New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ResumeUpload onUploadSuccess={handleResumeUploadSuccess} />
          )}
        </TabsContent>
        
        <TabsContent value="job" className="mt-4">
          <JobLinkParser onParseSuccess={handleJobParseSuccess} />
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Contact Information</CardTitle>
          <CardDescription>Who do you want to ask for a referral?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobData ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input 
                    id="contact-name"
                    placeholder="Jane Smith"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email"
                    type="email"
                    placeholder="jane.smith@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-company">Company</Label>
                  <Input 
                    id="contact-company"
                    placeholder="Company Name"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-position">Position (Optional)</Label>
                  <Input 
                    id="contact-position"
                    placeholder="Engineering Manager"
                    value={contactPosition}
                    onChange={(e) => setContactPosition(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <ReferralContactSuggestions 
                  jobTitle={jobData.title}
                  company={jobData.company}
                  onContactSelect={(contact) => {
                    setContactName(contact.name);
                    setContactEmail(contact.email);
                    setContactCompany(contact.company);
                    setContactPosition(contact.position);
                    toast.success(`Selected ${contact.name} as contact`);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserRound className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-medium">No job data available</h3>
              <p className="text-sm text-muted-foreground">
                Please parse a job posting first to get suggested contacts
              </p>
            </div>
          )}
          
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center">
              <Label>Email Tone</Label>
              <span className="font-medium">{getToneText()}</span>
            </div>
            <Slider
              value={[tone]}
              onValueChange={(values) => setTone(values[0])}
              max={100}
              step={1}
              className="mt-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Friendly</span>
              <span>Neutral</span>
              <span>Formal</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea
              id="custom-message"
              placeholder="Add a personal touch to your referral request..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={generateEmail}
            disabled={isGenerating || !resumeData || !jobData || !contactName || !contactEmail}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Email"}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Your Referral Email</DialogTitle>
            <DialogDescription>
              Review and send your personalized referral request to {contactName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-4 rounded-md flex-1">
                {generatedEmail ? (
                  <div className="whitespace-pre-line">
                    {generatedEmail}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="w-1/3 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recipient</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{contactName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground pl-6">
                    {contactEmail}
                  </div>
                </div>
                
                {jobData && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Job</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div>{jobData.title}</div>
                        <div className="text-muted-foreground">{jobData.company}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="gap-2"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsEmailDialogOpen(false)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              onClick={sendEmail}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 