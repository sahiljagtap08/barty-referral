/**
 * Email Finder Utility
 * 
 * This module helps find email addresses based on a person's name and company.
 * It uses common email patterns and verification techniques.
 */

import { openai } from './openai';

/**
 * Common email patterns used by companies
 */
const EMAIL_PATTERNS = [
  '{first}@{domain}.com',
  '{first}.{last}@{domain}.com',
  '{first}{last}@{domain}.com',
  '{first}_{last}@{domain}.com',
  '{first}.{last_initial}@{domain}.com',
  '{first_initial}{last}@{domain}.com',
  '{first_initial}.{last}@{domain}.com',
  '{last}@{domain}.com',
];

/**
 * Additional common domain extensions to try
 */
const DOMAIN_EXTENSIONS = [
  'com',
  'co',
  'io',
  'net',
  'org',
  'ai',
];

/**
 * Find possible email addresses for a person based on their name and company
 */
export async function findPossibleEmails(
  firstName: string,
  lastName: string,
  company: string
): Promise<string[]> {
  // Clean input
  firstName = firstName.toLowerCase().trim();
  lastName = lastName.toLowerCase().trim();

  // Create variations of the company domain
  const companyDomains = generateCompanyDomains(company);
  
  // Generate possible email addresses
  const possibleEmails: string[] = [];
  
  for (const domain of companyDomains) {
    for (const pattern of EMAIL_PATTERNS) {
      const email = generateEmailFromPattern(pattern, {
        first: firstName,
        last: lastName,
        first_initial: firstName.charAt(0),
        last_initial: lastName.charAt(0),
        domain
      });
      
      if (email && !possibleEmails.includes(email)) {
        possibleEmails.push(email);
      }
    }
  }
  
  return possibleEmails;
}

/**
 * Generate company domains based on company name
 */
function generateCompanyDomains(company: string): string[] {
  // Clean and normalize company name
  const companyName = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  
  if (companyName.length === 0) return [];
  
  const domains: string[] = [];
  
  // Main company name (e.g., "apple")
  if (companyName.length === 1) {
    const name = companyName[0];
    domains.push(name);
  } 
  // Multi-word company (e.g., "apple inc")
  else {
    // Join all words (e.g., "appleinc")
    domains.push(companyName.join(''));
    
    // Join with hyphens (e.g., "apple-inc")
    domains.push(companyName.join('-'));
    
    // Main word only (e.g., "apple")
    domains.push(companyName[0]);
    
    // For companies like "X Corp" or "Y Inc", try without the generic term
    if (companyName.length === 2) {
      const secondWord = companyName[1];
      if (['inc', 'corp', 'co', 'llc', 'ltd'].includes(secondWord)) {
        domains.push(companyName[0]);
      }
    }
  }
  
  // Add domain extensions to each base domain
  const result: string[] = [];
  for (const domain of domains) {
    for (const ext of DOMAIN_EXTENSIONS) {
      result.push(`${domain}.${ext}`);
    }
  }
  
  return Array.from(new Set(result)); // Remove duplicates
}

/**
 * Generate an email address from a pattern
 */
function generateEmailFromPattern(
  pattern: string,
  values: Record<string, string>
): string {
  let email = pattern;
  
  for (const [key, value] of Object.entries(values)) {
    email = email.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  
  return email;
}

/**
 * Verify if an email is valid (simplified implementation)
 * In production, you would use a proper email verification service
 */
export function isValidEmailFormat(email: string): boolean {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Use AI to predict the most likely email format for a company
 */
export async function predictCompanyEmailFormat(companyName: string): Promise<string | null> {
  try {
    const prompt = `
Based on common email patterns for tech companies, what is the most likely 
email format for ${companyName}? Consider company size, industry trends, 
and common practices. Return only the most probable pattern from this list:

- first@domain.com
- first.last@domain.com
- firstlast@domain.com
- first_last@domain.com
- first.l@domain.com
- flast@domain.com
- f.last@domain.com
- last@domain.com

Just return the single most likely pattern, nothing else.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You predict the most likely email format used by a company.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content?.trim();
    
    // Map the response to our pattern format
    const patternMap: Record<string, string> = {
      'first@domain.com': '{first}@{domain}.com',
      'first.last@domain.com': '{first}.{last}@{domain}.com',
      'firstlast@domain.com': '{first}{last}@{domain}.com',
      'first_last@domain.com': '{first}_{last}@{domain}.com',
      'first.l@domain.com': '{first}.{last_initial}@{domain}.com',
      'flast@domain.com': '{first_initial}{last}@{domain}.com',
      'f.last@domain.com': '{first_initial}.{last}@{domain}.com',
      'last@domain.com': '{last}@{domain}.com',
    };
    
    return patternMap[response || ''] || null;
  } catch (error) {
    console.error('Error predicting company email format:', error);
    return null;
  }
} 