import { TrendingUp } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function SkillsMasteredCard() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  // Count skills that are above required level
  const masteredSkills = assessmentResult?.skillGaps?.filter(
    gap => (gap.currentLevel || 0) >= (gap.requiredLevel || 0)
  ).length || 8;

  return (
    <div className="bento-no-min h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="font-heading text-xl text-foreground">Skills Mastered</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          New skills acquired
        </p>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-purple-600">{masteredSkills}</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-body text-muted-foreground">This month</span>
          <span className="font-body text-green-600 font-medium">+{Math.floor(masteredSkills * 0.3)}</span>
        </div>
      </div>
    </div>
  );
}
