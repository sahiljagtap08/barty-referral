// Server component
import { constructMetadata } from "@/lib/utils";
import VoiceSearchClient from "./voice-search-client";

export const metadata = constructMetadata({
  title: "Voice Search – Barty",
  description: "Search for referral opportunities using your voice.",
});

export default function VoiceSearchPage() {
  return <VoiceSearchClient />;
} 