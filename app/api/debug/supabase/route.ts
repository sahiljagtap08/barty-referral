import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { supabase as browserClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Check environment variables (redacting sensitive parts)
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
        ? `✓ Set (starts with: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...)` 
        : '✗ Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY 
        ? `✓ Set (starts with: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5)}...)` 
        : '✗ Missing',
    };
    
    // Test different client initializations
    let serverClientCheck = 'Failed - Error initializing';
    let browserClientCheck = 'Failed - Error initializing';
    
    try {
      const serverClient = createServerSupabaseClient();
      serverClientCheck = serverClient ? '✓ Initialized properly' : '✗ Failed to initialize';
    } catch (err: any) {
      serverClientCheck = `Error: ${err.message}`;
    }
    
    try {
      browserClientCheck = browserClient ? '✓ Initialized properly' : '✗ Failed to initialize';
    } catch (err: any) {
      browserClientCheck = `Error: ${err.message}`;
    }
    
    // Test service role
    let serviceRoleCheck = 'Failed to test';
    try {
      const serviceClient = createServerSupabaseClient(true);
      const { count, error } = await serviceClient
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      serviceRoleCheck = error 
        ? `Error accessing profiles: ${error.message}` 
        : `✓ Successfully accessed profiles table (${count} records)`;
    } catch (err: any) {
      serviceRoleCheck = `Error: ${err.message}`;
    }
    
    // Test explicit import
    let directImportCheck = 'Not tested';
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      directImportCheck = (typeof createClient === 'function')
        ? '✓ Direct imports work correctly'
        : '✗ Direct imports failed';
    } catch (err: any) {
      directImportCheck = `Error importing directly: ${err.message}`;
    }
    
    return NextResponse.json({
      diagnostics: {
        environment: envCheck,
        clients: {
          serverClient: serverClientCheck,
          browserClient: browserClientCheck,
          serviceRole: serviceRoleCheck,
          directImportCheck
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: "Diagnostic error",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 