"use client";

import { useState, useRef } from "react";
import { Search, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { speechToText } from "@/lib/elevenlabs";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ReferralSearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Search for people at companies (e.g., software engineers at Google)",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mpeg" });
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        try {
          // Convert to text using ElevenLabs
          const text = await speechToText(arrayBuffer);
          setQuery(text);
          
          // Close audio stream
          stream.getTracks().forEach(track => track.stop());
          
          // Auto search after voice input
          if (text) {
            onSearch(text);
          }
        } catch (error) {
          console.error("Speech to text error:", error);
          toast.error("Could not recognize speech. Please try again or type your query.");
        }
        
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <Card className="p-3 shadow-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-16 h-12 text-base"
          disabled={isLoading || isRecording}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={`h-8 w-8 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">
              {isRecording ? "Stop recording" : "Start voice search"}
            </span>
          </Button>
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading || isRecording}
            size="sm"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
    </Card>
  );
} 