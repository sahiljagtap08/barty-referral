import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Placeholder for now - will be replaced with actual auth
const DEMO_USER_ID = 'demo-user-id';

export async function GET(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user ID from authentication
    const userId = DEMO_USER_ID;
    
    // Get Supabase client
    const supabase = createServerSupabaseClient(true); // use service role
    
    // Fetch the latest resume for the user
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      // If the error is 'No rows found', return a 404
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'No resume found for this user' },
          { status: 404 }
        );
      }
      
      // For other errors, return a 500
      console.error('Error fetching latest resume:', error);
      return NextResponse.json(
        { error: 'Failed to fetch resume' },
        { status: 500 }
      );
    }
    
    // Return the resume data
    return NextResponse.json({
      success: true,
      resume: data
    });
    
  } catch (error) {
    console.error('Error in latest resume API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 