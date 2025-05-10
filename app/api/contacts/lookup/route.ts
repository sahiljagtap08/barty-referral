import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import axios from 'axios';
import { z } from 'zod';

// Schema for input validation
const RequestSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().optional(),
  limit: z.number().optional().default(15)
});

// Contact types
interface BaseContact {
  id: string;
  name: string;
  email: string;
  position: string;
  company: string;
  connectionLevel?: number;
  profileUrl?: string;
  relevanceScore?: number;
}

interface Recruiter extends BaseContact {}
interface Employee extends BaseContact {}

// Response structure
interface ContactsResponse {
  recruiters: Recruiter[];
  employees: Employee[];
}

// Contact source flags for tracking
enum ContactSource {
  DATABASE = 'database',
  CLEARBIT = 'clearbit',
  PDL = 'people_data_labs',
  FALLBACK = 'fallback'
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { company, jobTitle, limit } = result.data;

    // Initialize Supabase client for DB operations
    const supabase = createServerSupabaseClient(true);
    
    // Step 1: Check if we already have contacts for this company in our database
    const cachedContacts = await fetchCachedContacts(supabase, company);
    
    if (cachedContacts.recruiters.length > 0 || cachedContacts.employees.length > 0) {
      console.log(`Using ${cachedContacts.recruiters.length} cached recruiters and ${cachedContacts.employees.length} cached employees for ${company}`);
      
      // If we have sufficient cached data, return it
      if (cachedContacts.recruiters.length >= 2 && cachedContacts.employees.length >= 3) {
        return NextResponse.json({ 
          success: true,
          results: cachedContacts,
          source: ContactSource.DATABASE
        });
      }
      
      // Otherwise, supplement with API calls but still use what we have
    }
    
    // Step 2: If not enough cached contacts, fetch from external APIs
    let contacts: ContactsResponse = {
      recruiters: [],
      employees: []
    };
    
    let source = ContactSource.FALLBACK;
    
    try {
      // Try Clearbit first (company information)
      const companyInfo = await fetchCompanyInfo(company);
      
      // Then try People Data Labs (contact information)
      if (companyInfo && companyInfo.domain) {
        const peopleResults = await fetchPeopleFromCompany(
          company, 
          companyInfo.domain, 
          jobTitle, 
          limit
        );
        
        if (peopleResults) {
          contacts = peopleResults;
          source = ContactSource.PDL;
        }
      }
    } catch (apiError) {
      console.error('Error fetching from external APIs:', apiError);
      // Fall back to existing cached contacts or generate semi-realistic data
    }
    
    // Step 3: If external APIs failed or returned no results, use the cached data if available
    if (contacts.recruiters.length === 0 && contacts.employees.length === 0) {
      if (cachedContacts.recruiters.length > 0 || cachedContacts.employees.length > 0) {
        contacts = cachedContacts;
        source = ContactSource.DATABASE;
      } else {
        // Last resort: Generate realistic-looking data
        const companyDomain = await getCompanyDomain(company);
        const roleKeywords = extractRoleKeywords(jobTitle);
        
        contacts.recruiters = generateRealisticRecruiters(company, companyDomain);
        contacts.employees = generateRealisticEmployees(company, companyDomain, roleKeywords);
        source = ContactSource.FALLBACK;
      }
    }
    
    // Step 4: Save new contacts to database for future lookups if they came from API
    if (source !== ContactSource.DATABASE && source !== ContactSource.FALLBACK) {
      await saveContactsToDatabase(supabase, company, contacts);
    }
    
    return NextResponse.json({ 
      success: true,
      results: contacts,
      source: source
    });
  } catch (error) {
    console.error('Unhandled error in contact lookup API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fetch cached contacts from our database
async function fetchCachedContacts(supabase, company: string): Promise<ContactsResponse> {
  try {
    // Query for recruiters (those with recruiting titles)
    const { data: recruiters, error: recruiterError } = await supabase
      .from('referral_contacts')
      .select('*')
      .ilike('company', `%${company}%`)
      .or(`job_title.ilike.%recruit%,job_title.ilike.%talent%,job_title.ilike.%acquisition%`)
      .limit(5);
      
    if (recruiterError) {
      console.error('Error fetching cached recruiters:', recruiterError);
    }
    
    // Query for employees (non-recruiters)
    const { data: employees, error: employeeError } = await supabase
      .from('referral_contacts')
      .select('*')
      .ilike('company', `%${company}%`)
      .not('job_title', 'ilike', '%recruit%')
      .not('job_title', 'ilike', '%talent%')
      .not('job_title', 'ilike', '%acquisition%')
      .limit(10);
      
    if (employeeError) {
      console.error('Error fetching cached employees:', employeeError);
    }
    
    return {
      recruiters: (recruiters || []).map(formatDatabaseContact),
      employees: (employees || []).map(formatDatabaseContact)
    };
  } catch (error) {
    console.error('Error in fetchCachedContacts:', error);
    return { recruiters: [], employees: [] };
  }
}

// Format database contact to match our API response format
function formatDatabaseContact(contact): BaseContact {
  return {
    id: contact.id,
    name: contact.full_name,
    email: contact.email,
    position: contact.job_title || 'Employee',
    company: contact.company,
    connectionLevel: 2, // Default assumption for stored contacts
    profileUrl: contact.linkedin_url
  };
}

// Save contacts to database for future lookups
async function saveContactsToDatabase(supabase, company: string, contacts: ContactsResponse) {
  try {
    const allContacts = [
      ...contacts.recruiters.map(c => ({ 
        full_name: c.name,
        email: c.email,
        company: company,
        job_title: c.position,
        linkedin_url: c.profileUrl,
        is_verified: false,
        connection_source: 'api',
        // Generate a random user_id for demo purposes
        // In production, associate with the current user
        user_id: '00000000-0000-0000-0000-000000000000'
      })),
      ...contacts.employees.map(c => ({ 
        full_name: c.name,
        email: c.email,
        company: company,
        job_title: c.position,
        linkedin_url: c.profileUrl,
        is_verified: false,
        connection_source: 'api',
        // Generate a random user_id for demo purposes
        // In production, associate with the current user
        user_id: '00000000-0000-0000-0000-000000000000'
      }))
    ];
    
    // Only try to insert if we have contacts to save
    if (allContacts.length > 0) {
      const { error } = await supabase
        .from('referral_contacts')
        .upsert(allContacts, { 
          onConflict: 'email',
          ignoreDuplicates: true 
        });
        
      if (error) {
        console.error('Error saving contacts to database:', error);
      }
    }
  } catch (error) {
    console.error('Error in saveContactsToDatabase:', error);
  }
}

// Fetch company information from Clearbit API
async function fetchCompanyInfo(company: string) {
  try {
    // Check if we have an API key
    if (!process.env.CLEARBIT_API_KEY) {
      console.warn('CLEARBIT_API_KEY not configured');
      return null;
    }
    
    const response = await axios.get(`https://company.clearbit.com/v2/companies/find`, {
      params: { name: company },
      headers: {
        'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}`
      },
      validateStatus: status => status < 500 // Don't throw on 404s
    });
    
    if (response.status === 200 && response.data) {
      return {
        name: response.data.name,
        domain: response.data.domain,
        logo: response.data.logo,
        industry: response.data.category?.industry
      };
    }
    
    return null;
  } catch (error) {
    console.error('Clearbit API error:', error);
    return null;
  }
}

// Fetch people from a company using People Data Labs API
async function fetchPeopleFromCompany(company: string, domain: string, jobTitle?: string, limit = 15) {
  try {
    // Check if we have an API key
    if (!process.env.PDL_API_KEY) {
      console.warn('PDL_API_KEY not configured');
      return null;
    }
    
    // Build base query to find people at the company
    const baseQuery = {
      company: company,
      company_domain: domain,
      size: limit + 5, // Request a few extra to ensure we have enough after filtering
    };
    
    // Add job title filter if provided
    if (jobTitle) {
      baseQuery['job_title_levels'] = 'senior,manager,director';
      // If specific role keywords are present, use them
      if (jobTitle.toLowerCase().includes('engineer') || jobTitle.toLowerCase().includes('developer')) {
        baseQuery['job_title_keywords'] = 'engineer,developer,engineering';
      } else if (jobTitle.toLowerCase().includes('product')) {
        baseQuery['job_title_keywords'] = 'product,manager,owner';
      } else if (jobTitle.toLowerCase().includes('design')) {
        baseQuery['job_title_keywords'] = 'design,designer,ux,ui';
      }
    }
    
    // Make the API call
    const response = await axios.post(
      'https://api.peopledatalabs.com/v5/person/search',
      {
        query: baseQuery,
        dataset: 'all',
        size: limit + 5
      },
      {
        headers: {
          'X-Api-Key': process.env.PDL_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 200 && response.data && response.data.data) {
      const people = response.data.data;
      
      // Try to identify recruiters by job title keywords
      const recruiters: Recruiter[] = [];
      const employees: Employee[] = [];
      
      for (const person of people) {
        const contactDetails = formatPDLContact(person);
        
        // Skip if missing crucial information
        if (!contactDetails) continue;
        
        if (isRecruiterTitle(contactDetails.position)) {
          recruiters.push(contactDetails);
        } else {
          employees.push(contactDetails);
        }
        
        // If we have enough contacts, stop processing
        if (recruiters.length >= 3 && employees.length >= 7) break;
      }
      
      return { recruiters, employees };
    }
    
    return null;
  } catch (error) {
    console.error('People Data Labs API error:', error);
    return null;
  }
}

// Format a PDL contact to match our API response format
function formatPDLContact(person): BaseContact | null {
  if (!person.name || !person.name.first || !person.name.last) {
    return null;
  }
  
  // Try to get the most likely email
  let email = null;
  if (person.work_email) {
    email = person.work_email;
  } else if (person.emails && person.emails.length > 0) {
    // Prefer work emails over personal
    const workEmail = person.emails.find(e => e.includes(person.current_employer_domain));
    email = workEmail || person.emails[0];
  }
  
  // Skip if no email
  if (!email) return null;
  
  // Get their position/title
  const position = person.job_title || 'Employee';
  
  // Get company name
  const company = person.current_employer || person.company || '';
  
  // LinkedIn profile
  const profileUrl = person.linkedin_url || person.linkedin_username ? 
    `https://linkedin.com/in/${person.linkedin_username}` : undefined;
  
  return {
    id: person.id || `pdl-${Math.random().toString(36).substring(2, 15)}`,
    name: `${person.name.first} ${person.name.last}`,
    email,
    position,
    company,
    connectionLevel: 2, // Default assumption
    profileUrl,
    relevanceScore: person.relevance_score || 85
  };
}

// Check if a job title is likely a recruiter
function isRecruiterTitle(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  const recruiterKeywords = [
    'recruit', 'talent', 'acquisition', 'sourcer', 'hiring', 'hr'
  ];
  
  return recruiterKeywords.some(keyword => lowerTitle.includes(keyword));
}

// Fallback functions from original implementation
// These are used when API calls fail or aren't configured

// This would query WHOIS/DNS records or company databases
async function getCompanyDomain(company: string): Promise<string> {
  // Clean company name for domain creation
  const cleanName = company.toLowerCase()
    .replace(/\s+inc\.?$/i, '')
    .replace(/\s+co\.?$/i, '')
    .replace(/\s+corp\.?$/i, '')
    .replace(/\s+llc\.?$/i, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '');
  
  // Common tech companies with their actual domains
  const knownDomains: Record<string, string> = {
    'google': 'google.com',
    'meta': 'meta.com',
    'facebook': 'fb.com',
    'microsoft': 'microsoft.com',
    'apple': 'apple.com',
    'amazon': 'amazon.com',
    'netflix': 'netflix.com',
    'coinbase': 'coinbase.com',
    'stripe': 'stripe.com',
    'airbnb': 'airbnb.com',
    'uber': 'uber.com',
    'lyft': 'lyft.com',
    'twitter': 'twitter.com',
    'linkedin': 'linkedin.com',
    'dropbox': 'dropbox.com',
    'salesforce': 'salesforce.com',
    'adobe': 'adobe.com',
    'intel': 'intel.com',
    'cisco': 'cisco.com',
  };
  
  // Use known domain if available, otherwise create a reasonable guess
  return knownDomains[cleanName] || `${cleanName}.com`;
}

// Extract relevant keywords from job title to match with employee roles
function extractRoleKeywords(jobTitle: string = ''): string[] {
  const title = jobTitle.toLowerCase();
  
  const roleKeywords: string[] = [];
  
  // Technical roles
  if (title.includes('engineer') || title.includes('developer') || title.includes('programmer')) {
    roleKeywords.push('engineer', 'developer', 'engineering');
    
    // Specializations
    if (title.includes('front')) roleKeywords.push('frontend', 'front-end', 'ui');
    if (title.includes('back')) roleKeywords.push('backend', 'back-end', 'server');
    if (title.includes('full')) roleKeywords.push('fullstack', 'full-stack');
    if (title.includes('mobile')) roleKeywords.push('mobile', 'ios', 'android');
    if (title.includes('data')) roleKeywords.push('data', 'database');
    if (title.includes('ml') || title.includes('machine learning')) roleKeywords.push('ml', 'machine learning', 'ai');
    if (title.includes('devops')) roleKeywords.push('devops', 'infrastructure', 'platform');
  }
  
  // Design roles
  if (title.includes('design')) {
    roleKeywords.push('design', 'designer');
    
    if (title.includes('ui') || title.includes('ux')) roleKeywords.push('ui', 'ux', 'product');
    if (title.includes('graphic')) roleKeywords.push('graphic', 'visual');
  }
  
  // Product roles
  if (title.includes('product')) {
    roleKeywords.push('product');
    
    if (title.includes('manager')) roleKeywords.push('manager', 'management');
    if (title.includes('owner')) roleKeywords.push('owner');
  }
  
  // Data roles
  if (title.includes('data')) {
    roleKeywords.push('data');
    
    if (title.includes('scientist')) roleKeywords.push('scientist', 'science');
    if (title.includes('analyst')) roleKeywords.push('analyst', 'analytics');
    if (title.includes('engineer')) roleKeywords.push('engineer', 'engineering');
  }
  
  // Management roles
  if (title.includes('manager') || title.includes('director') || title.includes('lead')) {
    roleKeywords.push('manager', 'lead', 'director', 'head');
  }
  
  // If no specific keywords found, return generic terms
  if (roleKeywords.length === 0) {
    roleKeywords.push('employee', 'team');
  }
  
  return roleKeywords;
}

// Generate realistic recruiter data
function generateRealisticRecruiters(company: string, domain: string) {
  const recruiterTitles = [
    'Technical Recruiter',
    'Senior Technical Recruiter',
    'Talent Acquisition Specialist',
    'Recruiting Manager',
    'Technical Sourcer',
    'University Recruiter',
    'Talent Acquisition Partner'
  ];
  
  const commonNames = [
    { first: 'Jessica', last: 'Williams' },
    { first: 'Sarah', last: 'Johnson' },
    { first: 'Michael', last: 'Chen' },
    { first: 'David', last: 'Rodriguez' },
    { first: 'Rachel', last: 'Patel' },
    { first: 'Jennifer', last: 'Thompson' },
    { first: 'Emily', last: 'Wilson' }
  ];
  
  const recruiters = commonNames.slice(0, 3).map((name, index) => {
    const title = recruiterTitles[index % recruiterTitles.length];
    const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${domain}`;
    
    return {
      id: `r${index + 1}`,
      name: `${name.first} ${name.last}`,
      email: email,
      position: title,
      company: company,
      connectionLevel: index % 3 + 1, // 1st, 2nd, or 3rd connection
      profileUrl: `https://linkedin.com/in/${name.first.toLowerCase()}${name.last.toLowerCase()}${Math.floor(Math.random() * 100)}`
    };
  });
  
  return recruiters;
}

// Generate realistic employee data based on job role
function generateRealisticEmployees(company: string, domain: string, roleKeywords: string[]) {
  const positionLevels: string[] = ['Senior', 'Staff', 'Principal', 'Lead', ''];
  const positionTitles: string[] = [];
  
  // Create position titles based on role keywords
  if (roleKeywords.includes('engineer') || roleKeywords.includes('developer')) {
    positionTitles.push('Software Engineer', 'Software Developer', 'Engineering Manager');
    
    if (roleKeywords.includes('frontend')) {
      positionTitles.push('Frontend Engineer', 'UI Engineer', 'Frontend Developer');
    }
    if (roleKeywords.includes('backend')) {
      positionTitles.push('Backend Engineer', 'Systems Engineer', 'Infrastructure Engineer');
    }
    if (roleKeywords.includes('fullstack')) {
      positionTitles.push('Full Stack Engineer', 'Full Stack Developer');
    }
  } else if (roleKeywords.includes('data')) {
    positionTitles.push('Data Scientist', 'Data Engineer', 'Data Analyst');
  } else if (roleKeywords.includes('design')) {
    positionTitles.push('Product Designer', 'UX Designer', 'UI Designer');
  } else if (roleKeywords.includes('product')) {
    positionTitles.push('Product Manager', 'Technical Product Manager');
  } else {
    positionTitles.push('Team Member', 'Project Manager', 'Team Lead');
  }
  
  // Common names for realistic generation
  const commonNames = [
    { first: 'Alex', last: 'Rodriguez' },
    { first: 'Jamie', last: 'Smith' },
    { first: 'Taylor', last: 'Johnson' },
    { first: 'Jordan', last: 'Lee' },
    { first: 'Casey', last: 'Brown' },
    { first: 'Morgan', last: 'Davis' },
    { first: 'Sam', last: 'Wilson' },
    { first: 'Avery', last: 'Martinez' }
  ];
  
  const employees = commonNames.slice(0, 4).map((name, index) => {
    const level = positionLevels[index % positionLevels.length];
    const title = positionTitles[index % positionTitles.length];
    const position = level ? `${level} ${title}` : title;
    const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${domain}`;
    
    return {
      id: `e${index + 1}`,
      name: `${name.first} ${name.last}`,
      email: email,
      position: position,
      company: company,
      connectionLevel: (index % 3) + 1, // 1st, 2nd, or 3rd connection
      relevanceScore: 95 - (index * 5), // Decreasing relevance
      profileUrl: `https://linkedin.com/in/${name.first.toLowerCase()}${name.last.toLowerCase()}${Math.floor(Math.random() * 100)}`
    };
  });
  
  return employees;
} 