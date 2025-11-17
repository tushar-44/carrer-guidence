import { Suspense, useState } from "react";
import { InterestSelector } from "./InterestSelector";
import { QuizFlow } from "./QuizFlow";
import { AssessmentResults } from "./AssessmentResults";

type AssessmentStage = "interests" | "quiz" | "results";

export default function AssessmentPage() {
  const [stage, setStage] = useState<AssessmentStage>("interests");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [hasStarted, setHasStarted] = useState(false);

  const handleInterestsSelected = (interests: string[]) => {
    setSelectedInterests(interests);
    setStage("quiz");
  };

  const handleQuizComplete = (answers: Record<string, string>) => {
    setAssessmentAnswers(answers);
    setStage("results");
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        {!hasStarted ? (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Career Assessment</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover your ideal career path with our comprehensive assessment. Answer a few questions about your interests, skills, and preferences to get personalized career recommendations.
              </p>
              <button
                onClick={() => setHasStarted(true)}
                className="px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Assessment
              </button>
            </div>
          </div>
        ) : (
          <>
            {stage === "interests" && (
              <InterestSelector onInterestsSelected={handleInterestsSelected} />
            )}
            {stage === "quiz" && (
              <QuizFlow interests={selectedInterests} onQuizComplete={handleQuizComplete} />
            )}
            {stage === "results" && (
              <AssessmentResults answers={assessmentAnswers} interests={selectedInterests} />
            )}
          </>
        )}
      </Suspense>
    </div>
  );
}
