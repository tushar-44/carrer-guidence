"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { useSession } from "next-auth/react"; // TODO: Add NextAuth later

const interestOptions = [
  { id: "technology", label: "Technology", icon: "💻", description: "Software, AI, hardware" },
  { id: "design", label: "Design", icon: "🎨", description: "UI/UX, graphics, creative" },
  { id: "business", label: "Business", icon: "💼", description: "Management, finance, strategy" },
  { id: "marketing", label: "Marketing", icon: "📈", description: "Digital marketing, sales" },
  { id: "data", label: "Data Science", icon: "📊", description: "Analytics, ML, statistics" },
  { id: "healthcare", label: "Healthcare", icon: "🏥", description: "Medical, wellness, biotech" },
  { id: "education", label: "Education", icon: "📚", description: "Teaching, training, e-learning" },
  { id: "creative", label: "Creative Arts", icon: "🎭", description: "Writing, media, entertainment" },
];

interface InterestSelectorProps {
  onInterestsSelected: (interests: string[]) => void;
}

export function InterestSelector({ onInterestsSelected }: InterestSelectorProps) {
  // const { data: session } = useSession(); // TODO: Add NextAuth later
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [_hasStarted, setHasStarted] = useState(false);

  // Check for existing interests from user profile
  // useEffect(() => {
  //   if (session?.user?.interests) {
  //     setSelectedInterests(session.user.interests);
  //   }
  // }, [session]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNotSure = () => {
    setShowSuggestions(true);
    // Suggest 3-5 trending fields
    const suggestions = ["technology", "data", "business", "design"];
    setSelectedInterests(suggestions);
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onInterestsSelected(selectedInterests);
    }
  };

  if (showSuggestions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Based on current trends, we suggest:</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {selectedInterests.map(interestId => {
              const interest = interestOptions.find(opt => opt.id === interestId);
              return interest ? (
                <Badge key={interestId} variant="secondary" className="p-3 text-lg">
                  {interest.icon} {interest.label}
                </Badge>
              ) : null;
            })}
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setShowSuggestions(false)}>
              Choose Different
            </Button>
            <Button onClick={handleContinue}>
              Continue with These
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">What interests you?</h1>
          <p className="text-lg text-muted-foreground">
            Select all areas that excite you. This will help us create a personalized assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {interestOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedInterests.includes(option.id)
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleInterestToggle(option.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold mb-2">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={() => setHasStarted(true)}
            disabled={selectedInterests.length === 0}
          >
            Start Assessment
          </Button>
          <div>
            <Button variant="link" onClick={handleNotSure}>
              I'm not sure, suggest for me
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
