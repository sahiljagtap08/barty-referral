export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          job_title: string | null
          skills: string[] | null
          experience_level: string | null
          preferred_companies: string[] | null
          resume_url: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          city: string | null
          country: string | null
          timezone: string | null
          visa_status: string | null
          is_looking_for_job: boolean
          email_settings: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          job_title?: string | null
          skills?: string[] | null
          experience_level?: string | null
          preferred_companies?: string[] | null
          resume_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          city?: string | null
          country?: string | null
          timezone?: string | null
          visa_status?: string | null
          is_looking_for_job?: boolean
          email_settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          job_title?: string | null
          skills?: string[] | null
          experience_level?: string | null
          preferred_companies?: string[] | null
          resume_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          city?: string | null
          country?: string | null
          timezone?: string | null
          visa_status?: string | null
          is_looking_for_job?: boolean
          email_settings?: Json | null
        }
      }
      referral_contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          full_name: string
          email: string
          company: string
          job_title: string | null
          linkedin_url: string | null
          connection_source: string | null
          location: string | null
          department: string | null
          is_verified: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          full_name: string
          email: string
          company: string
          job_title?: string | null
          linkedin_url?: string | null
          connection_source?: string | null
          location?: string | null
          department?: string | null
          is_verified?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          email?: string
          company?: string
          job_title?: string | null
          linkedin_url?: string | null
          connection_source?: string | null
          location?: string | null
          department?: string | null
          is_verified?: boolean
          metadata?: Json | null
        }
      }
      emails: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          contact_id: string
          subject: string
          content: string
          status: 'pending' | 'sent' | 'delivered' | 'opened' | 'replied' | 'bounced' | 'failed'
          sent_at: string | null
          opened_at: string | null
          replied_at: string | null
          tracking_id: string | null
          email_type: 'initial' | 'follow_up'
          follow_up_count: number
          parent_email_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          contact_id: string
          subject: string
          content: string
          status?: 'pending' | 'sent' | 'delivered' | 'opened' | 'replied' | 'bounced' | 'failed'
          sent_at?: string | null
          opened_at?: string | null
          replied_at?: string | null
          tracking_id?: string | null
          email_type?: 'initial' | 'follow_up'
          follow_up_count?: number
          parent_email_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          contact_id?: string
          subject?: string
          content?: string
          status?: 'pending' | 'sent' | 'delivered' | 'opened' | 'replied' | 'bounced' | 'failed'
          sent_at?: string | null
          opened_at?: string | null
          replied_at?: string | null
          tracking_id?: string | null
          email_type?: 'initial' | 'follow_up'
          follow_up_count?: number
          parent_email_id?: string | null
          metadata?: Json | null
        }
      }
      email_accounts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          email: string
          provider: 'gmail' | 'outlook' | 'other'
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          is_verified: boolean
          is_primary: boolean
          signature: string | null
          display_name: string | null
          daily_send_limit: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          email: string
          provider: 'gmail' | 'outlook' | 'other'
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          is_verified?: boolean
          is_primary?: boolean
          signature?: string | null
          display_name?: string | null
          daily_send_limit?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          email?: string
          provider?: 'gmail' | 'outlook' | 'other'
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          is_verified?: boolean
          is_primary?: boolean
          signature?: string | null
          display_name?: string | null
          daily_send_limit?: number
        }
      }
      companies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          domain: string
          logo_url: string | null
          industry: string | null
          description: string | null
          headquarters: string | null
          website_url: string | null
          linkedin_url: string | null
          size_range: string | null
          founded_year: number | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          domain: string
          logo_url?: string | null
          industry?: string | null
          description?: string | null
          headquarters?: string | null
          website_url?: string | null
          linkedin_url?: string | null
          size_range?: string | null
          founded_year?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          domain?: string
          logo_url?: string | null
          industry?: string | null
          description?: string | null
          headquarters?: string | null
          website_url?: string | null
          linkedin_url?: string | null
          size_range?: string | null
          founded_year?: number | null
          metadata?: Json | null
        }
      }
      user_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          enable_auto_followup: boolean
          followup_interval_days: number
          max_followups: number
          track_email_opens: boolean
          track_email_clicks: boolean
          receive_email_notifications: boolean
          enable_browser_notifications: boolean
          theme_preference: 'light' | 'dark' | 'system'
          timezone: string
          daily_email_limit: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          enable_auto_followup?: boolean
          followup_interval_days?: number
          max_followups?: number
          track_email_opens?: boolean
          track_email_clicks?: boolean
          receive_email_notifications?: boolean
          enable_browser_notifications?: boolean
          theme_preference?: 'light' | 'dark' | 'system'
          timezone?: string
          daily_email_limit?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          enable_auto_followup?: boolean
          followup_interval_days?: number
          max_followups?: number
          track_email_opens?: boolean
          track_email_clicks?: boolean
          receive_email_notifications?: boolean
          enable_browser_notifications?: boolean
          theme_preference?: 'light' | 'dark' | 'system'
          timezone?: string
          daily_email_limit?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 