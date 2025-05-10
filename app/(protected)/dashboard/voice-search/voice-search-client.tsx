"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";

export default function VoiceSearchClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSearchText("");
    setSearchResults([]);
    
    // Start timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 10) {
          clearInterval(timer);
          stopRecording();
          return 10;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Simulate recording for demo
    setTimeout(() => {
      setSearchText("Software Engineers at Google in Seattle");
      stopRecording();
      clearInterval(timer);
      
      // Simulate loading results
      setTimeout(() => {
        setSearchResults([
          {
            id: 1,
            name: "John Smith",
            position: "Senior Software Engineer",
            company: "Google",
            location: "Seattle, WA"
          },
          {
            id: 2,
            name: "Sarah Johnson",
            position: "Software Engineer II",
            company: "Google",
            location: "Seattle, WA"
          },
          {
            id: 3,
            name: "Michael Lee",
            position: "Engineering Manager",
            company: "Google",
            location: "Seattle, WA"
          }
        ]);
      }, 1500);
    }, 3000);
    
    toast.info("Listening...");
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success("Processing your voice query...");
  };

  return (
    <>
      <DashboardHeader
        heading="Voice Search"
        text="Search for potential referrers by speaking your query"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Speak your search query</CardTitle>
            <CardDescription>
              Try saying "Software Engineers at Google in Seattle"
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`h-24 w-24 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Icons.mic className="h-10 w-10" />
            </Button>
            
            {isRecording && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Recording... {recordingTime}s</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="animate-pulse block w-1 h-2 bg-primary rounded-full"></span>
                  <span className="animate-pulse block w-1 h-3 bg-primary rounded-full animation-delay-100"></span>
                  <span className="animate-pulse block w-1 h-4 bg-primary rounded-full animation-delay-200"></span>
                  <span className="animate-pulse block w-1 h-6 bg-primary rounded-full animation-delay-300"></span>
                  <span className="animate-pulse block w-1 h-8 bg-primary rounded-full animation-delay-400"></span>
                  <span className="animate-pulse block w-1 h-6 bg-primary rounded-full animation-delay-300"></span>
                  <span className="animate-pulse block w-1 h-4 bg-primary rounded-full animation-delay-200"></span>
                  <span className="animate-pulse block w-1 h-3 bg-primary rounded-full animation-delay-100"></span>
                  <span className="animate-pulse block w-1 h-2 bg-primary rounded-full"></span>
                </div>
              </div>
            )}
            
            {searchText && !isRecording && (
              <div className="mt-6 text-center">
                <p className="font-medium">I heard:</p>
                <p className="text-lg mt-2 px-4 py-2 bg-muted rounded-md">{searchText}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} potential contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {searchResults.map((person) => (
                  <div key={person.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.position} at {person.company}</p>
                      <p className="text-sm text-muted-foreground">{person.location}</p>
                    </div>
                    <Button>Send Request</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
} 