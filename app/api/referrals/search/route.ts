import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { parseSearchQuery } from "@/lib/search-utils";
import { searchLinkedInProfiles } from "@/lib/linkedin-scraper";
import { findPossibleEmails } from "@/lib/email-finder";

// Demo user ID for testing without auth
const DEMO_USER_ID = "demo-user-id";

export async function POST(req: NextRequest) {
  try {
    // Use the demo user ID
    const userId = DEMO_USER_ID;
    
    // Parse the request body
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid search query" },
        { status: 400 }
      );
    }
    
    // Parse the search query
    const { company, title, location } = parseSearchQuery(query);
    
    // Search for profiles
    const profiles = await searchLinkedInProfiles({
      company,
      title,
      location,
    });
    
    // Find emails for each profile
    const profilesWithEmails = await Promise.all(
      profiles.map(async (profile) => {
        if (!profile.name || !profile.company) return { ...profile };
        
        const nameParts = profile.name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
        
        try {
          const possibleEmails = await findPossibleEmails(
            firstName,
            lastName,
            profile.company
          );
          
          return {
            ...profile,
            email: possibleEmails.length > 0 ? possibleEmails[0] : undefined,
          };
        } catch (error) {
          console.error("Error finding emails:", error);
          return { ...profile };
        }
      })
    );
    
    // Save search query to user history in Supabase
    const supabase = createServerSupabaseClient();
    await supabase.from("search_history").insert({
      user_id: userId,
      query,
      company,
      job_title: title,
      location,
      result_count: profiles.length,
    });
    
    return NextResponse.json({
      results: profilesWithEmails,
      query,
      parsed: { company, title, location },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 