"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

// Company logo data structure
interface CompanyLogo {
  name: string;
  logo: string;
}

// Array of companies with their logo paths
// You'll need to add these logo files to public/company_logos/
const companies: CompanyLogo[] = [
  // First row
  { name: "Amazon", logo: "/company_logos/amazon.png" },
  { name: "Apple", logo: "/company_logos/apple.png" },
  { name: "Tesla", logo: "/company_logos/tesla.png" },
  { name: "Google", logo: "/company_logos/google.png" },
  { name: "Microsoft", logo: "/company_logos/microsoft.png" },
  { name: "Spotify", logo: "/company_logos/spotify.png" },
  { name: "Disney", logo: "/company_logos/disney.png" },
  { name: "Comcast", logo: "/company_logos/comcast.png" },
  
  // Second row
  { name: "Chewy", logo: "/company_logos/chewy.png" },
  { name: "IBM", logo: "/company_logos/ibm.png" },
  { name: "Intel", logo: "/company_logos/intel.png" },
  { name: "Boeing", logo: "/company_logos/boeing.png" },
  { name: "Starbucks", logo: "/company_logos/starbucks.png" },
  { name: "Pinterest", logo: "/company_logos/pinterest.png" },
  { name: "Target", logo: "/company_logos/target.png" },
  { name: "Atlassian", logo: "/company_logos/atlassian.png" },
  
  // Third row
  { name: "Upwork", logo: "/company_logos/upwork.png" },
  { name: "Splunk", logo: "/company_logos/splunk.png" },
  { name: "Dropbox", logo: "/company_logos/dropbox.png" },
  { name: "Goldman Sachs", logo: "/company_logos/goldman-sachs.png" },
  { name: "Morgan Stanley", logo: "/company_logos/morgan-stanley.png" },
  { name: "Wells Fargo", logo: "/company_logos/wells-fargo.png" },
  { name: "Adobe", logo: "/company_logos/adobe.png" },
  { name: "Salesforce", logo: "/company_logos/salesforce.png" },
  
  // Fourth row
  { name: "Highspot", logo: "/company_logos/highspot.png" },
  { name: "Citadel", logo: "/company_logos/citadel.png" },
  { name: "Jump Trading", logo: "/company_logos/jumptrading.png" },
  { name: "Uber", logo: "/company_logos/uber.png" },
  { name: "Oracle", logo: "/company_logos/oracle.png" },
  { name: "Cisco", logo: "/company_logos/cisco.png" },
  { name: "VMware", logo: "/company_logos/vmware.png" },
  { name: "EY", logo: "/company_logos/ey.png" },
];

export default function CompanyLogos() {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Unlock doors at <span className="text-gradient_indigo-purple">1000+ dream companies</span>
          </h2>
          
          <div className="bg-green-100 text-green-800 rounded-full py-2 px-4 mt-6 inline-flex items-center gap-2">
            <svg 
              className="h-5 w-5 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">433 career-changing referrals last month alone</span>
          </div>
          
          <p className="max-w-3xl mx-auto mt-5 text-lg text-muted-foreground">
            Skip the application black hole. Our insiders at top companies are ready to champion your 
            resume. One click connects you to the people who can actually make hiring happen.
          </p>
        </div>
        
        {/* Logo grid - rendered in 4 rows */}
        <div className="grid gap-6">
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {companies.slice(0, 8).map((company) => (
              <CompanyLogoCard key={company.name} company={company} />
            ))}
          </div>
          
          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {companies.slice(8, 16).map((company) => (
              <CompanyLogoCard key={company.name} company={company} />
            ))}
          </div>
          
          {/* Row 3 */}
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {companies.slice(16, 24).map((company) => (
              <CompanyLogoCard key={company.name} company={company} />
            ))}
          </div>
          
          {/* Row 4 */}
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {companies.slice(24, 32).map((company) => (
              <CompanyLogoCard key={company.name} company={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Component for individual company logo card
function CompanyLogoCard({ company }: { company: CompanyLogo }) {
  return (
    <Card className="flex flex-col items-center justify-center p-4 h-28 transition-all hover:shadow-md">
      <div className="flex items-center justify-center w-12 h-12 mb-2">
        <div className="relative w-10 h-10 overflow-hidden rounded-full">
          <Image
            src={company.logo}
            alt={`${company.name} logo`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <p className="text-xs font-medium text-center">{company.name}</p>
    </Card>
  );
} 