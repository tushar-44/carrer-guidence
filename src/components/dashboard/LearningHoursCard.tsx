import { TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function LearningHoursCard() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  // Calculate learning hours based on completed roadmap steps
  const completedSteps = assessmentResult?.roadmap?.filter(step => step.completed).length || 0;
  const totalSteps = assessmentResult?.roadmap?.length || 10;
  const learningHours = Math.round((completedSteps / totalSteps) * 24); // Mock calculation

  return (
    <div className="bento-no-min h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="font-heading text-xl text-foreground">Learning Hours</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          This Month
        </p>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-green-600">{learningHours}h</div>
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Target: 30h</span>
          <span className="font-body text-foreground font-medium">
            {Math.round((learningHours / 30) * 100)}%
          </span>
        </div>
        <Progress value={(learningHours / 30) * 100} className="h-2" />
      </div>
    </div>
  );
}
