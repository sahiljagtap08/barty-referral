"use client";

import { useState, useEffect } from "react";
import { CheckCircle, UserRound, Search, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Contact {
  id: string;
  name: string;
  email: string;
  position: string;
  company: string;
  avatarUrl?: string;
  relevanceScore?: number;
  connectionLevel?: number; // 1 = 1st, 2 = 2nd, 3 = 3rd connection
  profileUrl?: string; // LinkedIn profile URL
}

interface ReferralContactSuggestionsProps {
  jobTitle?: string;
  company?: string;
  onContactSelect: (contact: Contact) => void;
  className?: string;
}

export function ReferralContactSuggestions({
  jobTitle,
  company,
  onContactSelect,
  className = "",
}: ReferralContactSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recruiters, setRecruiters] = useState<Contact[]>([]);
  const [employees, setEmployees] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);

  // Fetch contacts when component mounts or job/company changes
  useEffect(() => {
    const fetchContacts = async () => {
      // Skip fetching if no company provided
      if (!company) {
        setIsLoading(false);
        setRecruiters([]);
        setEmployees([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Real API call to our contacts lookup endpoint
        const response = await fetch('/api/contacts/lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company,
            jobTitle,
            limit: 15,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch contacts');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setRecruiters(data.results.recruiters || []);
          setEmployees(data.results.employees || []);
          setDataSource(data.source || 'api');
        } else {
          throw new Error(data.error || 'Failed to fetch contacts');
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        
        // Fallback to mock data if API fails
        const mockRecruiters = generateMockRecruiters(company);
        const mockEmployees = generateMockEmployees(company, jobTitle);
        
        setRecruiters(mockRecruiters);
        setEmployees(mockEmployees);
        setDataSource('fallback');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [company, jobTitle]);
  
  // Select a contact
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    onContactSelect(contact);
  };
  
  // Filter contacts based on search term
  const filteredRecruiters = recruiters.filter(
    contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               contact.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEmployees = employees.filter(
    contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               contact.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Contact Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {!company ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Building className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-medium">No company selected</h3>
            <p className="text-sm text-muted-foreground">
              Enter a company name to find contacts
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="recruiters">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="recruiters" className="flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                Recruiters
                <Badge variant="secondary" className="ml-1">
                  {filteredRecruiters.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Employees
                <Badge variant="secondary" className="ml-1">
                  {filteredEmployees.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recruiters" className="mt-0">
            {filteredRecruiters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-medium">No recruiters found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search or company
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {filteredRecruiters.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContact?.id === contact.id}
                    onSelect={handleContactSelect}
                    getInitials={getInitials}
                  />
                ))}
              </div>
            )}
            </TabsContent>
            
            <TabsContent value="employees" className="mt-0">
            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="font-medium">No employees found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search or company
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {filteredEmployees.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContact?.id === contact.id}
                    onSelect={handleContactSelect}
                    getInitials={getInitials}
                  />
                ))}
              </div>
            )}
            </TabsContent>
          </Tabs>
        )}
        
        {selectedContact && (
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleContactSelect(selectedContact)}
                className="gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                Selected
              </Button>
            </div>
          </div>
        )}
        
        {dataSource && dataSource !== 'database' && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            <p>
              {dataSource === 'fallback' 
                ? 'Using sample data. Contact details may not be accurate.' 
                : 'Contact data is provided by third-party services and may not be fully accurate.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (contact: Contact) => void;
  getInitials: (name: string) => string;
}

function ContactCard({ contact, isSelected, onSelect, getInitials }: ContactCardProps) {
  return (
    <div 
      className={`flex items-center justify-between p-2 rounded-lg ${
        isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
      } border transition-colors cursor-pointer`}
      onClick={() => onSelect(contact)}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatarUrl} />
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm flex items-center gap-1.5">
            {contact.name}
            {contact.connectionLevel && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                {contact.connectionLevel}{getConnectionSuffix(contact.connectionLevel)}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{contact.position}</p>
          {contact.profileUrl && (
            <a 
              href={contact.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 hover:underline"
            >
              LinkedIn Profile
            </a>
          )}
        </div>
      </div>
      
      <Button 
        variant={isSelected ? "default" : "outline"} 
        size="sm"
        className="h-8"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(contact);
        }}
      >
        {isSelected ? "Selected" : "Select"}
      </Button>
    </div>
  );
}

// Helper function to get connection suffix
function getConnectionSuffix(level: number): string {
  switch (level) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// Mock data generators - used as fallback if API fails
function generateMockRecruiters(company?: string): Contact[] {
  const companyName = company || "Tech Company";
  return [
    {
      id: "r1",
      name: "Sarah Johnson",
      email: `sarah.johnson@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: "Technical Recruiter",
      company: companyName,
      avatarUrl: "",
      connectionLevel: 2
    },
    {
      id: "r2",
      name: "Michael Chen",
      email: `michael.chen@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: "Senior Recruiter",
      company: companyName,
      avatarUrl: "",
      connectionLevel: 3
    },
    {
      id: "r3",
      name: "Jessica Williams",
      email: `jessica.williams@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: "Talent Acquisition Manager",
      company: companyName,
      avatarUrl: "",
      connectionLevel: 2
    }
  ];
}

function generateMockEmployees(company?: string, jobTitle?: string): Contact[] {
  const companyName = company || "Tech Company";
  const title = jobTitle || "Engineer";
  const titleWords = title.split(' ');
  const roleWord = titleWords[titleWords.length - 1];
  
  return [
    {
      id: "e1",
      name: "Alex Rodriguez",
      email: `alex.rodriguez@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: `Senior ${roleWord}`,
      company: companyName,
      avatarUrl: "",
      connectionLevel: 1,
      relevanceScore: 95
    },
    {
      id: "e2",
      name: "Jamie Smith",
      email: `jamie.smith@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: `${roleWord} Manager`,
      company: companyName,
      avatarUrl: "",
      connectionLevel: 2,
      relevanceScore: 87
    },
    {
      id: "e3",
      name: "Taylor Johnson",
      email: `taylor.johnson@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: `Staff ${roleWord}`,
      company: companyName,
      avatarUrl: "",
      connectionLevel: 2,
      relevanceScore: 83
    },
    {
      id: "e4",
      name: "Jordan Lee",
      email: `jordan.lee@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      position: `Principal ${roleWord}`,
      company: companyName,
      avatarUrl: "",
      connectionLevel: 3,
      relevanceScore: 79
    }
  ];
} 