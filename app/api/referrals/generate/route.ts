import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateEmailContent } from "@/lib/openai";

// Placeholder for now - will be replaced with actual auth
const DEMO_USER_ID = "demo-user-id";

export async function POST(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user ID from authentication
    const userId = DEMO_USER_ID;
    
    // Parse the request body
    const {
      resumeId,
      jobId,
      recipientName,
      recipientEmail,
      company,
      jobTitle,
      customMessage,
      tone = "professional"
    } = await req.json();
    
    // Validate required fields
    if (!recipientName || !recipientEmail || !company || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required recipient information" },
        { status: 400 }
      );
    }
    
    if (!resumeId && !jobId) {
      return NextResponse.json(
        { error: "Either resume or job information is required" },
        { status: 400 }
      );
    }
    
    // Get Supabase client
    const supabase = createServerSupabaseClient(true); // use service role
    
    // Get resume data if resumeId is provided
    let resumeData: any = null;
    let resumeText: string | undefined = undefined;
    if (resumeId) {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();
        
      if (error) {
        console.error("Error fetching resume:", error);
      } else {
        resumeData = data;
        resumeText = resumeData?.parsed_content?.text || undefined;
      }
    }
    
    // Get job data if jobId is provided
    let jobData: any = null;
    let jobDescription: string | undefined = undefined;
    if (jobId) {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
        
      if (error) {
        console.error("Error fetching job:", error);
      } else {
        jobData = data;
        jobDescription = jobData?.job_description || undefined;
      }
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.warn("Profile not found, using default values");
    }
    
    // Prepare recipient info for email generation
    const recipientInfo = {
      name: recipientName,
      company,
      jobTitle: recipientEmail?.includes("@") ? recipientEmail.split("@")[1] : "Professional",
      location: jobData?.job_location || undefined,
    };
    
    // Prepare sender info for email generation
    const senderInfo = {
      name: profile?.full_name || "Job Seeker",
      jobTitle: profile?.job_title || "Professional",
      skills: profile?.skills || [],
      resumeText,
      experience: profile?.experience_level || undefined,
    };
    
    // Generate email content
    const emailContent = await generateEmailContent({
      recipientInfo,
      senderInfo,
      jobDescription,
      customInstructions: `${customMessage || ""}\nUse a ${tone} tone.`,
    });
    
    // Return the generated email content
    return NextResponse.json({
      success: true,
      emailContent,
    });
    
  } catch (error) {
    console.error("Error generating email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 