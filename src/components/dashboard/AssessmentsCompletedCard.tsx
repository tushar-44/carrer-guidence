import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function AssessmentsCompletedCard() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  const totalCategories = 5; // aptitude, interests, personality, eq, skills-readiness
  const completedCategories = assessmentResult ? Object.keys(assessmentResult.categories).length : 3;

  return (
    <div className="bento-no-min h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="font-heading text-xl text-foreground">Assessments</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Completed
        </p>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-blue-600">{completedCategories}/{totalCategories}</div>
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Progress</span>
          <span className="font-body text-foreground font-medium">
            {Math.round((completedCategories / totalCategories) * 100)}%
          </span>
        </div>
        <Progress value={(completedCategories / totalCategories) * 100} className="h-2" />
      </div>
    </div>
  );
}
