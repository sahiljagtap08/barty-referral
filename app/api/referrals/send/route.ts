import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createServerSupabaseClient } from "@/lib/supabase";
import { sendEmail, generateEmailTemplate } from "@/lib/resend";
import { generateEmailContent } from "@/lib/openai";

// Demo user ID for testing without auth
const DEMO_USER_ID = "demo-user-id";

export async function POST(req: NextRequest) {
  try {
    // Use the demo user ID
    const userId = DEMO_USER_ID;
    
    // Parse the request body
    const {
      recipientName,
      recipientEmail,
      company,
      jobTitle,
      customMessage,
      includeResume = true
    } = await req.json();
    
    // Validate required fields
    if (!recipientName || !recipientEmail || !company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get the user's profile from Supabase
    const supabase = createServerSupabaseClient();
    // First try to find an existing profile
    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    // If profile doesn't exist, create a demo profile
    if (!profile) {
      const demoProfile = {
        id: userId,
        full_name: "Demo User",
        job_title: "Software Engineer",
        experience_level: "Mid-level",
        skills: ["JavaScript", "React", "TypeScript"],
      };
      
      // Insert the demo profile
      await supabase
        .from("profiles")
        .upsert(demoProfile);
        
      profile = demoProfile;
    }
    
    // Generate default email settings
    const emailSettings = {
      user_id: userId,
      tone_preference: "professional",
      follow_up_enabled: true,
    };
    
    // Create a demo email account if none exists
    const { data: emailAccount } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .single();
    
    const demoEmailAccount = emailAccount || {
      user_id: userId,
      email: "demo@example.com",
      is_primary: true,
      signature: "Best regards,\nDemo User",
    };
    
    // Get signature
    const signature = demoEmailAccount.signature || "Best regards,\n" + profile.full_name;
    
    // Generate tracking ID
    const trackingId = uuidv4();
    
    // Generate email content using AI
    const emailContent = await generateEmailContent({
      recipientInfo: {
        name: recipientName,
        company,
        jobTitle: jobTitle || "",
        // Add more fields if available
      },
      senderInfo: {
        name: profile.full_name || "Demo User",
        jobTitle: profile.job_title || "",
        skills: profile.skills || [],
        experience: profile.experience_level || "",
        // Add more fields from profile
      },
      customInstructions: customMessage,
    });
    
    // Parse the generated content to extract subject and body
    let subject = "";
    let body = "";
    
    if (emailContent) {
      // Extract subject line (assuming it's the first line)
      const contentLines = emailContent.split('\n');
      if (contentLines[0].toLowerCase().startsWith('subject:')) {
        subject = contentLines[0].substring('subject:'.length).trim();
        body = contentLines.slice(1).join('\n').trim();
      } else {
        subject = `Referral Request: ${profile.full_name} for ${company}`;
        body = emailContent;
      }
    } else {
      // Fallback subject and body if generation fails
      subject = `Referral Request: ${profile.full_name} for ${company}`;
      body = `Dear ${recipientName},\n\nI hope this email finds you well. I am reaching out to inquire about the possibility of a referral at ${company}.\n\n${customMessage ? customMessage + "\n\n" : ""}I would be grateful for the opportunity to discuss my qualifications further. My resume is attached for your reference.\n\nThank you for your time and consideration.\n\n`;
    }
    
    // Prepare email with HTML formatting
    const htmlBody = body.split('\n').map(line => `<p>${line}</p>`).join('');
    
    // Generate complete email HTML with tracking pixel
    const emailHtml = generateEmailTemplate({
      content: htmlBody,
      trackingId,
      signature,
    });
    
    // Get user's resume if includeResume is true
    let attachments = [];
    if (includeResume && profile.resume_url) {
      // In a real implementation, you'd fetch the resume from storage
      // For now, we'll just simulate this
    }
    
    // Create an entry in the emails table
    const { data: emailRecord, error: emailError } = await supabase
      .from("emails")
      .insert({
        user_id: userId,
        contact_id: recipientEmail, // Using email as contact ID until we create a contact
        subject,
        content: emailContent,
        status: "pending",
        email_type: "initial",
        follow_up_count: 0,
        tracking_id: trackingId,
      })
      .select()
      .single();
    
    if (emailError) {
      console.error("Error creating email record:", emailError);
      return NextResponse.json(
        { error: "Failed to create email record" },
        { status: 500 }
      );
    }
    
    // Send the email using Resend
    const result = await sendEmail({
      from: `${profile.full_name} <${demoEmailAccount.email}>`,
      to: recipientEmail,
      subject,
      html: emailHtml,
      replyTo: demoEmailAccount.email,
      attachments,
      tags: [
        { name: "email_id", value: emailRecord.id },
        { name: "tracking_id", value: trackingId },
      ],
    });
    
    // Update the email record with sent status
    if (result.success) {
      await supabase
        .from("emails")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", emailRecord.id);
    }
    
    // Also create or update a contact record
    const { data: contact, error: contactError } = await supabase
      .from("referral_contacts")
      .upsert({
        user_id: userId,
        full_name: recipientName,
        email: recipientEmail,
        company,
        job_title: jobTitle || null,
        is_verified: false,
      })
      .select()
      .single();
    
    if (contactError) {
      console.error("Error creating contact record:", contactError);
      // Continue anyway since the email was sent
    }
    
    return NextResponse.json({
      success: true,
      message: "Referral request sent",
      emailId: emailRecord.id,
      contactId: contact?.id,
    });
  } catch (error) {
    console.error("Send referral API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 