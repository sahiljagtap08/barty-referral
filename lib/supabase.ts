import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables in supabase.ts');
}

// Create a single supabase client for browser client-side
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side client with optional service role for admin operations
export const createServerSupabaseClient = (useServiceRole = false) => {
  // Use service role key if requested, otherwise use anon key
  const apiKey = useServiceRole ? serviceRoleKey : supabaseAnonKey;
  
  if (!supabaseUrl) {
    throw new Error('Supabase URL is missing');
  }
  
  if (useServiceRole && !serviceRoleKey) {
    console.error('Service role key is missing but was requested');
    throw new Error('Service role key is required but missing');
  }
  
  if (!apiKey) {
    throw new Error('Supabase API key is missing');
  }
  
  try {
    return createClient<Database>(supabaseUrl, apiKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
};

// Note: The server client with cookies is now in lib/supabase-server.ts 