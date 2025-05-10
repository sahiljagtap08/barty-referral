/**
 * Parse a search query into structured components
 * @param query The search query string
 * @returns Object with parsed company, title, and location
 */
export function parseSearchQuery(query: string) {
  let company = "";
  let title = "";
  let location = "";
  
  // Match "X at Y in Z" pattern
  const titleCompanyLocationRegex = /(.+?)\s+at\s+(.+?)(?:\s+in\s+(.+))?$/i;
  const match = query.match(titleCompanyLocationRegex);
  
  if (match) {
    title = match[1].trim();
    company = match[2].trim();
    location = match[3]?.trim() || "";
  } else {
    // Fallback - just use the query as a title
    title = query;
  }
  
  return { company, title, location };
}

/**
 * Format search terms for display
 * @param params Search parameters
 * @returns Formatted search display string
 */
export function formatSearchDisplay({
  company,
  title,
  location,
}: {
  company?: string;
  title?: string;
  location?: string;
}) {
  const parts: string[] = [];
  
  if (title) parts.push(title);
  if (company) parts.push(`at ${company}`);
  if (location) parts.push(`in ${location}`);
  
  return parts.join(" ");
}

/**
 * Extract companies from a search query
 * @param query The search query string
 * @returns Array of extracted company names
 */
export function extractCompanies(query: string): string[] {
  // Common patterns:
  // - "at [Company]"
  // - "from [Company]"
  // - "@[Company]"
  
  const patterns = [
    /(?:at|@)\s*([A-Z][A-Za-z0-9\s&]+?)(?:\s+in|\s*$)/g,
    /from\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+in|\s*$)/g,
  ];
  
  const companies = new Set<string>();
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(query)) !== null) {
      if (match[1]) {
        companies.add(match[1].trim());
      }
    }
  }
  
  return Array.from(companies);
}

/**
 * Extract job titles from a search query
 * @param query The search query string
 * @returns Array of extracted job titles
 */
export function extractJobTitles(query: string): string[] {
  // Common job title patterns
  const commonTitles = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "Designer",
    "Marketing Manager",
    "Sales Representative",
    "UX Designer",
    "Project Manager",
    "Business Analyst",
    "DevOps Engineer",
  ];
  
  const titles = new Set<string>();
  
  // Look for job titles at the beginning or before "at"
  const titleBeforeCompanyPattern = /^([\w\s]+?)(?:\s+at|\s*$)/i;
  const match = query.match(titleBeforeCompanyPattern);
  
  if (match && match[1]) {
    titles.add(match[1].trim());
  }
  
  // Check for common titles in the query
  for (const title of commonTitles) {
    if (query.toLowerCase().includes(title.toLowerCase())) {
      titles.add(title);
    }
  }
  
  return Array.from(titles);
}

/**
 * Extract locations from a search query
 * @param query The search query string
 * @returns Array of extracted locations
 */
export function extractLocations(query: string): string[] {
  // Pattern: "in [Location]"
  const locationPattern = /in\s+([A-Za-z\s,]+)(?:\s|$)/gi;
  
  const locations = new Set<string>();
  let match;
  
  while ((match = locationPattern.exec(query)) !== null) {
    if (match[1]) {
      locations.add(match[1].trim());
    }
  }
  
  return Array.from(locations);
} 