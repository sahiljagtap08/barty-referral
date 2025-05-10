import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { parseResume, updateResumeWithParsedContent } from '@/lib/resume-parser';

// Placeholder for now - will be replaced with actual auth
const DEMO_USER_ID = 'demo-user-id';

export async function POST(req: NextRequest) {
  try {
    console.log('Resume upload API started');
    
    // In a real implementation, we'd get the user ID from authentication
    const userId = DEMO_USER_ID;
    
    // Get the form data with the file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.type, file.size);

    // Check file type
    if (!file.type.includes('pdf')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Get file as array buffer
    const fileBuffer = await file.arrayBuffer();
    console.log('File buffer created, length:', fileBuffer.byteLength);
    
    // Create a unique filename
    const fileName = `${userId}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    console.log('Generated filename:', fileName);
    
    // Get Supabase client
    const supabase = createServerSupabaseClient(true); // use service role
    console.log('Supabase client created with service role');
    
    // First verify we can list buckets
    try {
      console.log('Checking storage buckets...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        return NextResponse.json(
          { error: 'Failed to list storage buckets: ' + bucketsError.message },
          { status: 500 }
        );
      }
      
      console.log('Available buckets:', buckets?.map(b => b.name).join(', ') || 'none');
      
      // Check if the resumes bucket exists, create it if not
      const resumesBucketExists = buckets?.some(bucket => bucket.name === 'resumes');
      
      if (!resumesBucketExists) {
        console.log('Creating resumes bucket...');
        const { error: createBucketError } = await supabase.storage.createBucket('resumes', {
          public: true
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return NextResponse.json(
            { error: 'Failed to create storage bucket: ' + createBucketError.message },
            { status: 500 }
          );
        }
        console.log('Resumes bucket created successfully');
      }
      
      // Verify the bucket exists and is accessible
      const { data: bucketFiles, error: listFilesError } = await supabase.storage.from('resumes').list();
      if (listFilesError) {
        console.error('Error listing files in bucket:', listFilesError);
        return NextResponse.json(
          { error: 'Failed to access the resumes bucket: ' + listFilesError.message },
          { status: 500 }
        );
      }
      
      console.log('Current files in bucket:', bucketFiles?.length || 0);
      
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      return NextResponse.json(
        { error: 'Storage bucket setup failed: ' + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      );
    }
    
    // Upload file to Supabase Storage
    console.log('Uploading file to Supabase...');
    let uploadResult;
    try {
      uploadResult = await supabase
        .storage
        .from('resumes')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadResult.error) {
        console.error('Error uploading to Supabase:', uploadResult.error);
        return NextResponse.json(
          { error: 'Failed to upload file to storage: ' + uploadResult.error.message },
          { status: 500 }
        );
      }
      
      console.log('File uploaded successfully, path:', uploadResult.data?.path);
    } catch (uploadError) {
      console.error('Exception during upload:', uploadError);
      return NextResponse.json(
        { error: 'Exception during upload: ' + (uploadError instanceof Error ? uploadError.message : String(uploadError)) },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('resumes')
      .getPublicUrl(fileName);
      
    console.log('Public URL generated:', publicUrl);

    // Check if the resumes table exists and has the expected schema
    let resumeData;
    try {
      console.log('Saving metadata to database...');
      // Try to insert into the database
      const { data: insertData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type,
          public_url: publicUrl
        })
        .select()
        .single();

      if (dbError) {
        // If there's a schema error, log it but continue
        console.error('Database error:', dbError);
        // We still consider this a success since the file was uploaded
        resumeData = null;
      } else {
        console.log('Database entry created successfully');
        resumeData = insertData;
      }
    } catch (dbError) {
      console.error('Exception during database operation:', dbError);
      // Even if DB operations fail, the file was uploaded
    }

    // Verify the file exists in the bucket after upload
    try {
      const { data: verifyFiles, error: verifyError } = await supabase.storage.from('resumes').list();
      if (verifyError) {
        console.error('Error verifying upload:', verifyError);
      } else {
        console.log('Files in bucket after upload:', verifyFiles?.map(f => f.name).join(', ') || 'none');
        const fileExists = verifyFiles?.some(f => f.name === fileName);
        console.log('Uploaded file exists in bucket:', fileExists ? 'YES' : 'NO');
      }
    } catch (verifyError) {
      console.error('Exception during verification:', verifyError);
    }

    // Return success with file information
    return NextResponse.json({
      success: true,
      message: resumeData ? 'Resume uploaded successfully' : 'File uploaded but database entry failed',
      url: publicUrl,
      resume: resumeData || {
        user_id: userId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
        public_url: publicUrl
      }
    });
  } catch (error) {
    console.error('Unhandled error in resume upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// Schedule background parsing
export async function GET(req: NextRequest) {
  try {
    const resumeId = req.nextUrl.searchParams.get('id');
    
    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }
    
    // Get Supabase client
    const supabase = createServerSupabaseClient(true); // use service role
    
    // Get resume data
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
      
    if (resumeError) {
      return NextResponse.json(
        { error: 'Failed to fetch resume: ' + resumeError.message },
        { status: 500 }
      );
    }
    
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Parse the resume
    // Note: In a production environment, this would typically be handled
    // through a background job or queue
    try {
      console.log('Starting resume parsing for', resume.file_name);
      const parsedContent = await parseResume(resume.file_path, supabase);
      console.log('Resume parsed successfully');
      
      // Update the resume record with the parsed content
      await updateResumeWithParsedContent(resumeId, parsedContent, supabase);
      console.log('Resume record updated with parsed content');
    } catch (parseError) {
      console.error('Error parsing resume:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse resume: ' + (parseError instanceof Error ? parseError.message : String(parseError)) },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resume parsing completed',
    });
    
  } catch (error) {
    console.error('Error in parse resume API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 