"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  Search, 
  Loader2, 
  Building, 
  BriefcaseBusiness,
  Check,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

interface JobLinkParserProps {
  onParseSuccess?: (data: JobData) => void;
  onParseError?: (error: Error) => void;
  showCard?: boolean;
  className?: string;
}

export function JobLinkParser({
  onParseSuccess,
  onParseError,
  showCard = true,
  className = "",
}: JobLinkParserProps) {
  const [jobLink, setJobLink] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to validate LinkedIn job URL
  const isValidJobUrl = (url: string) => {
    return url.includes("linkedin.com/jobs") || 
           url.includes("linkedin.com/job") || 
           url.includes("jobs.lever.co") ||
           url.includes("greenhouse.io/jobs") ||
           url.includes("greenhouse.io/embed/job") ||
           url.includes("boards.greenhouse.io") ||
           url.includes("smartrecruiters.com") ||
           url.includes("workday.com");
  };

  // Parse job link
  const parseJobLink = async () => {
    if (!jobLink) {
      toast.error("Please enter a job link");
      return;
    }
    
    if (!isValidJobUrl(jobLink)) {
      toast.error("Please enter a valid job posting URL (LinkedIn, Lever, Greenhouse, etc.)");
      return;
    }
    
    setIsParsing(true);
    setError(null);
    
    try {
      // Call the API route to parse the job link
      const response = await fetch('/api/job/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobLink }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse job link');
      }
      
      // Extract and normalize job data
      const extractedJob: JobData = data.job;
      
      // Normalize field names (API might return different formats)
      const normalizedJob: JobData = {
        id: extractedJob.id,
        title: extractedJob.title || extractedJob.job_title || "Unknown Title",
        company: extractedJob.company || extractedJob.company_name || "Unknown Company",
        location: extractedJob.location || extractedJob.job_location,
        description: extractedJob.description || extractedJob.job_description,
        recruiterEmail: extractedJob.recruiterEmail || extractedJob.recruiter_email,
        requiredSkills: extractedJob.requiredSkills || extractedJob.job_skills || [],
        jobLink: extractedJob.jobLink || jobLink
      };
      
      // Set job data
      setJobData(normalizedJob);
      
      // Call success callback if provided
      if (onParseSuccess) {
        onParseSuccess(normalizedJob);
      }
      
      // Success message
      toast.success(`Job details extracted for ${normalizedJob.title} at ${normalizedJob.company}`);
      
    } catch (error) {
      console.error("Error parsing job link:", error);
      
      setError(error instanceof Error ? error.message : "Failed to parse job link");
      
      if (onParseError) {
        onParseError(error instanceof Error ? error : new Error("Job parsing failed"));
      }
      
      toast.error(error instanceof Error ? error.message : "Failed to parse job link. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const resetParser = () => {
    setJobLink("");
    setJobData(null);
    setError(null);
  };

  const content = (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="job-link">Job Posting URL</Label>
        <div className="flex gap-2">
          <Input 
            id="job-link"
            placeholder="https://www.linkedin.com/jobs/view/..." 
            className="h-10"
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
            disabled={isParsing || !!jobData}
          />
          {!jobData ? (
            <Button 
              onClick={parseJobLink}
              disabled={isParsing || !jobLink}
            >
              {isParsing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isParsing ? "Parsing..." : "Parse"}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={resetParser}
            >
              Reset
            </Button>
          )}
        </div>
        {error && (
          <div className="flex items-center text-destructive text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {isParsing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <div className="flex items-center">
                <BriefcaseBusiness className="h-5 w-5 mr-2 text-muted-foreground" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </motion.div>
        )}
        
        {jobData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border rounded-lg p-4 mt-4"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {jobData.title}
                      <Check className="h-4 w-4 text-green-500 ml-2" />
                    </h3>
                    <div className="text-muted-foreground">{jobData.company}</div>
                    {jobData.location && (
                      <div className="text-sm text-muted-foreground">{jobData.location}</div>
                    )}
                  </div>
                  <a 
                    href={jobData.jobLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              
              {(jobData.requiredSkills?.length || 0) > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobData.requiredSkills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {jobData.recruiterEmail && (
                <div>
                  <h4 className="text-sm font-medium">Recruiter Email</h4>
                  <div className="text-sm">{jobData.recruiterEmail}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Job Information</CardTitle>
        <CardDescription>
          Paste a job link to parse details for your referral email
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {content}
      </CardContent>
      
      {jobData && (
        <CardFooter className="flex justify-end">
          <Button disabled={!jobData}>
            Generate Email
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 