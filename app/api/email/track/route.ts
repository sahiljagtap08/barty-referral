import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// 1x1 transparent pixel in base64
const TRANSPARENT_PIXEL = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export async function GET(req: NextRequest) {
  try {
    // Get tracking ID from query params
    const searchParams = req.nextUrl.searchParams;
    const trackingId = searchParams.get("id");
    
    if (!trackingId) {
      // Return transparent pixel even if there's no tracking ID
      return new NextResponse(Buffer.from(TRANSPARENT_PIXEL, "base64"), {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }
    
    // Log the email open in Supabase
    const supabase = createServerSupabaseClient();
    
    // First, find the email with the tracking ID
    const { data: email } = await supabase
      .from("emails")
      .select("*")
      .eq("tracking_id", trackingId)
      .single();
    
    if (email) {
      // Only update if not already opened (first open)
      if (!email.opened_at) {
        await supabase
          .from("emails")
          .update({
            status: "opened",
            opened_at: new Date().toISOString(),
          })
          .eq("id", email.id);
      }
      
      // Optionally, log each open event for analytics
      await supabase
        .from("email_events")
        .insert({
          email_id: email.id,
          event_type: "open",
          metadata: {
            user_agent: req.headers.get("user-agent") || null,
            ip: req.headers.get("x-forwarded-for") || req.ip || null,
          },
        });
    }
    
    // Return transparent pixel
    return new NextResponse(Buffer.from(TRANSPARENT_PIXEL, "base64"), {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Email tracking error:", error);
    
    // Still return the transparent pixel even if tracking fails
    return new NextResponse(Buffer.from(TRANSPARENT_PIXEL, "base64"), {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }
}

// Also handle POST requests for compatibility with some email clients
export async function POST(req: NextRequest) {
  return GET(req);
} 