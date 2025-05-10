import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName } = await req.json();
    
    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing userId or email" },
        { status: 400 }
      );
    }
    
    console.log("Creating profile API called for:", { userId, email, fullName });
    
    // First try with regular client
    const supabase = createServerSupabaseClient();
    
    // Check if profile already exists to avoid duplicates
    let { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // Not "row not found" error
      console.error("Error checking for existing profile:", checkError);
    }
      
    if (existingProfile) {
      console.log("Profile already exists for user:", userId);
      return NextResponse.json(
        { success: true, message: "Profile already exists", profileId: existingProfile.id },
        { status: 200 }
      );
    }
    
    // Create the profile
    console.log("Creating new profile for user:", userId);
    
    // Using service role for profile creation to avoid permission issues
    const serviceClient = createServerSupabaseClient(true); // Pass true to use service role
    
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .insert({
        id: userId,
        email: email,
        full_name: fullName || email.split('@')[0],
        is_looking_for_job: true
      })
      .select()
      .single();
      
    if (profileError) {
      console.error("Error creating profile:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile", details: profileError.message },
        { status: 500 }
      );
    }
    
    // Create user settings
    const { error: settingsError } = await serviceClient
      .from("user_settings")
      .insert({
        user_id: userId
      });
      
    if (settingsError) {
      console.error("Error creating user settings:", settingsError);
      // Continue anyway since the profile was created
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Profile created successfully", 
        profileId: profile.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 