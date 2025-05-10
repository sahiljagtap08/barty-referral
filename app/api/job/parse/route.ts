import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Placeholder for now - will be replaced with actual auth
const DEMO_USER_ID = 'demo-user-id';

export async function POST(req: NextRequest) {
  try {
    // In a real implementation, we'd get the user ID from authentication
    const userId = DEMO_USER_ID;
    
    // Get the job link from the request
    const { jobLink } = await req.json();
    
    if (!jobLink) {
      return NextResponse.json(
        { error: 'No job link provided' },
        { status: 400 }
      );
    }

    // Validate that this is a supported job URL
    const isValidJobUrl = (url: string) => {
      return url.includes('linkedin.com/jobs') || 
             url.includes('linkedin.com/job') || 
             url.includes('jobs.lever.co') ||
             url.includes('greenhouse.io/jobs') ||
             url.includes('greenhouse.io/embed/job') ||
             url.includes('boards.greenhouse.io') ||
             url.includes('smartrecruiters.com') ||
             url.includes('workday.com');
    };

    if (!isValidJobUrl(jobLink)) {
      return NextResponse.json(
        { error: 'Please provide a valid job URL (LinkedIn, Lever, Greenhouse, etc.)' },
        { status: 400 }
      );
    }

    // Determine which job board we're dealing with to parse appropriately
    let mockJobData: {
      title: string;
      company: string;
      location: string;
      description: string;
      recruiterEmail: string;
      requiredSkills: string[];
      jobLink: string;
    } = {
      title: '',
      company: '',
      location: '',
      description: '',
      recruiterEmail: '',
      requiredSkills: [],
      jobLink: jobLink
    };

    // Handle Greenhouse Coinbase job specifically (for demo purposes)
    if (jobLink.includes('boards.greenhouse.io') && jobLink.includes('coinbase')) {
      mockJobData = {
        title: 'Analytics Engineer',
        company: 'Coinbase',
        location: 'Remote - USA',
        description: 'The CX Analytics Engineering team bridges the gap between data engineering, data science, and business analytics by building scalable, impactful data solutions.',
        recruiterEmail: 'recruiting@coinbase.com',
        requiredSkills: ['SQL', 'Data Modeling', 'Python', 'Data Visualization', 'Prompt Engineering'],
        jobLink: jobLink
      };
    } else {
      // For other job boards, use generic mock data for now
      // In production, this would use a scraper or API for each job board
      mockJobData = {
        title: 'Senior Software Engineer',
        company: 'Example Tech',
        location: 'San Francisco, CA (Remote)',
        description: 'We are looking for a Senior Software Engineer with experience in React, Node.js, and TypeScript...',
        recruiterEmail: 'recruiter@exampletech.com',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'API Development'],
        jobLink: jobLink
      };
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get Supabase client
    const supabase = createServerSupabaseClient(true); // use service role
    
    // Try to save the job data to the database, but don't fail if table doesn't exist
    let jobData = null;
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: userId,
          job_title: mockJobData.title,
          company_name: mockJobData.company,
          job_location: mockJobData.location,
          job_description: mockJobData.description,
          recruiter_email: mockJobData.recruiterEmail,
          job_url: jobLink,
          job_skills: mockJobData.requiredSkills
        })
        .select()
        .single();

      if (error) {
        console.log('Warning: Could not save to jobs table:', error);
      } else {
        jobData = data;
      }
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database operations fail
    }

    // Return success with the job data
    return NextResponse.json({
      success: true,
      message: 'Job link parsed successfully',
      job: jobData || mockJobData
    });
  } catch (error) {
    console.error('Error in job parse API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 