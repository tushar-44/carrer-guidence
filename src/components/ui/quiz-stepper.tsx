import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizStep {
  id: number;
  question: string;
  options: string[];
}

const quizSteps: QuizStep[] = [
  {
    id: 1,
    question: "What type of work environment do you prefer?",
    options: [
      "Fast-paced startup with high innovation",
      "Stable corporate environment with clear structure",
      "Flexible remote work with autonomy",
      "Collaborative team-based projects"
    ]
  },
  {
    id: 2,
    question: "Which of these activities energizes you most?",
    options: [
      "Solving complex technical problems",
      "Creating and designing new concepts",
      "Analyzing data and finding insights",
      "Leading and mentoring others"
    ]
  },
  {
    id: 3,
    question: "What are your strongest technical skills?",
    options: [
      "Programming and software development",
      "Data analysis and visualization",
      "Design and user experience",
      "Project management and coordination"
    ]
  }
];

export function QuizStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const progress = ((currentStep + 1) / quizSteps.length) * 100;
  const currentQuizStep = quizSteps[currentStep];

  const handleNext = () => {
    if (selectedOption) {
      setAnswers(prev => ({ ...prev, [currentStep]: selectedOption }));
      if (currentStep < quizSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(answers[currentStep + 1] || "");
      } else {
        // Quiz completed - could trigger results
        console.log("Quiz completed!", answers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSelectedOption(answers[currentStep - 1] || "");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Career Assessment Quiz</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {quizSteps.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQuizStep.question}</h3>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
              {currentQuizStep.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
            >
              {currentStep === quizSteps.length - 1 ? "Complete Assessment" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
