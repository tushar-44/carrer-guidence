import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { Target, BookOpen } from 'lucide-react';

interface AssessmentResultsProps {
  answers: Record<string, string>;
  interests: string[];
}

export function AssessmentResults({ answers: _answers }: AssessmentResultsProps) {
  const navigate = useNavigate();
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Assessment Results Found</h2>
          <p className="text-muted-foreground mb-6">Please complete an assessment first.</p>
          <Button onClick={() => navigate('/assessment')}>
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  const { categories, recommendations, skillGaps } = assessmentResult;

  // Calculate overall score
  const overallScore = Object.values(categories).reduce((sum, cat) => sum + cat.percentage, 0) / Object.keys(categories).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Assessment Results</h1>
          <p className="text-xl text-muted-foreground">
            Congratulations! Here's your personalized career analysis.
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {Math.round(overallScore)}%
              </div>
              <p className="text-lg text-muted-foreground">Overall Career Readiness Score</p>
              <Progress value={overallScore} className="mt-4 h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Category Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(categories).map(([category, data]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg capitalize">
                  {category.replace('-', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {data.percentage}%
                </div>
                <Progress value={data.percentage} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {data.score} / {data.maxScore} points
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Career Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Career Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec: any) => (
                <div key={rec.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{rec.icon}</span>
                    <h3 className="font-semibold">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{rec.matchPercentage}% match</Badge>
                    <span className="text-sm font-medium">{rec.salaryRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skill Development Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillGaps.map((gap: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{gap.skill}</h4>
                    <p className="text-sm text-muted-foreground">
                      Current: {gap.currentLevel}/5 | Required: {gap.requiredLevel}/5
                    </p>
                  </div>
                  <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'}>
                    {gap.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/mentors')}>
            Find Mentors
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}
