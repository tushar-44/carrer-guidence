import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAssessmentStore, mockQuestions } from "@/stores/assessmentStore";
import type { AssessmentCategory } from "@/constants/index";

interface QuizQuestion {
  id: string;
  text: string;
  category: string;
}

export function QuizFlow({ interests, onQuizComplete }: { interests: string[]; onQuizComplete: () => void }) {
  const navigate = useNavigate();
  const { answerQuestion, completeAssessment } = useAssessmentStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Generate quiz questions based on interests
  const [questions] = useState<QuizQuestion[]>(() => {
    const allQuestions = Object.values(mockQuestions).flat();

    // Filter questions based on interests or return all if no interests
    const filteredQuestions = interests.length > 0
      ? allQuestions.filter((q) =>
          interests.some(interest =>
            q.category.toLowerCase().includes(interest.toLowerCase()) ||
            q.text.toLowerCase().includes(interest.toLowerCase())
          )
        )
      : allQuestions;

    // Return at least 10 questions, fallback to all if less
    return filteredQuestions.length >= 10 ? filteredQuestions.slice(0, 10) : allQuestions.slice(0, 10);
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer || !currentQuestion) return;

    // Convert answer to number (assuming scale of 1-5)
    const answerValue = parseInt(selectedAnswer) || 1;

    // Store answer
    const newAnswers = { ...answers, [currentQuestion.id]: answerValue };
    setAnswers(newAnswers);

    // Submit to store
    answerQuestion(currentQuestion.id, currentQuestion.category as AssessmentCategory, answerValue);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      // Quiz complete
      completeAssessment();
      onQuizComplete();
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Quiz...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Career Assessment Quiz</h1>
          <p className="text-muted-foreground mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                  <Label htmlFor={`option-${value}`} className="flex-1 cursor-pointer">
                    {value === 1 && "Strongly Disagree"}
                    {value === 2 && "Disagree"}
                    {value === 3 && "Neutral"}
                    {value === 4 && "Agree"}
                    {value === 5 && "Strongly Agree"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/assessment')}
            disabled={currentQuestionIndex === 0}
          >
            Back to Interests
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
}
