"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResumeUploadProps {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: Error) => void;
  onFileSelect?: (file: File | null) => void;
  className?: string;
  showCard?: boolean;
}

export function ResumeUpload({
  onUploadSuccess,
  onUploadError,
  onFileSelect,
  className = "",
  showCard = true
}: ResumeUploadProps) {
  // State for file upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  
  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setResumeFile(file);
    setUploadResult(null);
    
    if (onFileSelect) {
      onFileSelect(file);
    }
    
    toast.success(`Resume selected: ${file.name}`);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      
      setResumeFile(file);
      setUploadResult(null);
      
      if (onFileSelect) {
        onFileSelect(file);
      }
      
      toast.success(`Resume selected: ${file.name}`);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Reset the component
  const resetUpload = () => {
    setResumeFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Upload resume to Supabase
  const uploadResume = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume file first");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append("file", resumeFile);
      
      // Create an XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Set up promise to handle the response
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                reject(new Error("Failed to parse response"));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(new Error(errorData.error || "Upload failed"));
              } catch (_) {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
              }
            }
          }
        };
      });
      
      // Configure and send the request
      xhr.open("POST", "/api/resume/upload", true);
      xhr.send(formData);
      
      // Wait for completion
      const data = await uploadPromise;
      
      // Success handling
      setUploadResult({
        success: true,
        data
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
      
      toast.success(data.message || "Resume uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading resume:", error);
      
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload resume"
      });
      
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error("Upload failed"));
      }
      
      toast.error(error instanceof Error ? error.message : "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
      // Keep the progress at 100% if successful
      if (uploadResult?.success) {
        setUploadProgress(100);
      }
    }
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed ${
        resumeFile ? "border-primary" : "border-border"
      } rounded-md p-6 transition-colors duration-200 ease-in-out relative ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <Loader2 className="h-10 w-10 text-primary mb-4 animate-spin" />
            <p className="text-lg font-medium mb-4">Uploading resume...</p>
            <div className="w-full max-w-xs">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {uploadProgress}% complete
              </p>
            </div>
          </motion.div>
        ) : resumeFile && uploadResult?.success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-lg font-medium mb-2">Resume uploaded successfully!</p>
            <p className="text-sm text-muted-foreground mb-4">Your resume is ready for referrals</p>
            <Button variant="outline" onClick={resetUpload}>
              Upload a different resume
            </Button>
          </motion.div>
        ) : resumeFile && uploadResult?.error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-medium mb-2">Upload failed</p>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs">
              {uploadResult.error}
            </p>
            <div className="flex gap-2">
              <Button variant="default" onClick={uploadResume}>
                Try again
              </Button>
              <Button variant="outline" onClick={resetUpload}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : resumeFile ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <FileText className="h-12 w-12 text-primary mb-4" />
            <p className="text-lg font-medium mb-2">{resumeFile.name}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-2">
              <Button variant="default" onClick={uploadResume}>
                Upload Resume
              </Button>
              <Button variant="outline" onClick={resetUpload}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop your resume here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
        id="resume-upload"
      />
      
      {!isUploading && !uploadResult?.success && (
        <div className="absolute bottom-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Only PDF files are supported (max 5MB)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
        <CardDescription>Upload your resume to generate personalized referral emails</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        {content}
      </CardContent>
    </Card>
  );
} 