/**
 * LinkedIn Profile Scraper Utility
 * 
 * NOTE: Web scraping may be against LinkedIn's Terms of Service.
 * This is a simplified implementation for demonstration purposes.
 * In a production environment, consider using LinkedIn's official API
 * or a third-party service that complies with LinkedIn's terms.
 */

import { openai } from './openai';

export interface LinkedInProfile {
  name: string;
  headline?: string;
  location?: string;
  company?: string;
  position?: string;
  education?: string;
  connections?: string;
  about?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration?: string;
    location?: string;
    description?: string;
  }>;
  email?: string;
}

/**
 * Extract email from LinkedIn profile or use pattern matching to predict it
 */
export async function findEmailFromProfile(profile: LinkedInProfile): Promise<string | null> {
  // If email is directly available, return it
  if (profile.email) {
    return profile.email;
  }

  // If not, we'll need to use pattern matching to predict it
  if (!profile.name || !profile.company) {
    return null;
  }

  // This would be replaced with a more sophisticated email finder
  // service in production that complies with relevant terms and regulations
  return predictEmailAddress(profile.name, profile.company);
}

/**
 * Predict email address based on name and company
 * This is a simplified implementation - in production, you would use
 * a more sophisticated service or algorithm
 */
function predictEmailAddress(name: string, company: string): string | null {
  if (!name || !company) return null;
  
  // Clean company name to get domain
  const domain = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
  
  // Get first name
  const firstName = name.split(' ')[0].toLowerCase();
  
  // Common email patterns
  return `${firstName}@${domain}.com`;
}

/**
 * Fetch LinkedIn profile data
 * In production, this would use LinkedIn's API or a compliant third-party service
 */
export async function fetchLinkedInProfile(url: string): Promise<LinkedInProfile | null> {
  try {
    // This is a placeholder. In production, you would use:
    // 1. LinkedIn's official API with proper authorization
    // 2. A compliant third-party service
    // 3. Or implement a proper scraper with user consent
    
    // For demo purposes, we'll use a fake implementation
    // that returns mock data for any URL
    
    // Extract username from URL
    const username = url.split('/in/')[1]?.split('/')[0] || '';
    
    // Generate some basic profile information based on the username
    return {
      name: capitalizeWords(username.replace(/[^a-zA-Z0-9]/g, ' ')),
      headline: 'Software Engineer',
      company: 'TechCorp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      about: 'Experienced software engineer with passion for building scalable applications.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          duration: '2020 - Present',
          location: 'San Francisco, CA'
        },
        {
          title: 'Software Engineer',
          company: 'StartupInc',
          duration: '2018 - 2020',
          location: 'San Francisco, CA'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    return null;
  }
}

/**
 * Search for LinkedIn profiles based on criteria
 */
export async function searchLinkedInProfiles(query: {
  company?: string;
  title?: string;
  location?: string;
  keywords?: string[];
}): Promise<LinkedInProfile[]> {
  try {
    // This is a placeholder. In production, you would use:
    // 1. LinkedIn's official API with proper authorization
    // 2. A compliant third-party service
    
    // For demo purposes, we'll use a fake implementation
    // that returns mock data based on the query
    
    // Generate 5 fake profiles
    return Array(5).fill(0).map((_, index) => ({
      name: `Test Person ${index + 1}`,
      headline: query.title || 'Software Engineer',
      company: query.company || 'TechCorp',
      position: query.title || 'Software Engineer',
      location: query.location || 'San Francisco, CA',
      experience: [
        {
          title: query.title || 'Software Engineer',
          company: query.company || 'TechCorp',
          duration: '2020 - Present',
          location: query.location || 'San Francisco, CA'
        }
      ]
    }));
  } catch (error) {
    console.error('Error searching LinkedIn profiles:', error);
    return [];
  }
}

/**
 * Generate personalized intro based on LinkedIn profile data
 */
export async function generatePersonalizedIntro(
  profile: LinkedInProfile,
  userProfile: {
    name: string;
    role: string;
    experience?: string;
    skills?: string[];
  }
): Promise<string> {
  try {
    const prompt = `
Generate a short, personalized introduction paragraph for a referral email based on these profiles:

RECIPIENT:
- Name: ${profile.name}
- Position: ${profile.position || profile.headline || ''}
- Company: ${profile.company || ''}
- Education: ${profile.education || 'Not available'}
- Experience: ${profile.experience?.map(exp => `${exp.title} at ${exp.company}`).join(', ') || 'Not available'}

SENDER:
- Name: ${userProfile.name}
- Role: ${userProfile.role}
- Experience: ${userProfile.experience || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}

Create a very brief, personalized introduction (2-3 sentences) that:
1. Establishes a natural connection
2. Is warm but professional
3. Doesn't sound generic
4. Doesn't make up fake connections
5. Specifically mentions something from their profile
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You create brief, personalized email introductions based on LinkedIn profile data.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating personalized intro:', error);
    return '';
  }
}

// Helper function to capitalize words
function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
} 