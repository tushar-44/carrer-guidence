import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function CareerGoalCard() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  // Calculate progress based on assessment completion and skill development
  const totalAssessments = 5; // aptitude, interests, personality, eq, skills-readiness
  const completedAssessments = assessmentResult ? Object.keys(assessmentResult.categories).length : 3;
  const assessmentProgress = (completedAssessments / totalAssessments) * 100;

  const skillGaps = assessmentResult?.skillGaps || [];
  const avgSkillProgress = skillGaps.length > 0
    ? skillGaps.reduce((sum, gap) => sum + (gap.currentLevel || 0), 0) / skillGaps.length
    : 68;

  const overallProgress = Math.round((assessmentProgress + avgSkillProgress) / 2);

  return (
    <div className="bento-no-min h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="font-heading text-xl text-foreground">Current Goal</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          {assessmentResult?.recommendations?.[0]?.title
            ? `Land a ${assessmentResult.recommendations[0].title} role`
            : 'Land a Senior Frontend Developer role at a top tech company'
          }
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Progress</span>
          <span className="font-body text-foreground font-medium">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
    </div>
  );
}
