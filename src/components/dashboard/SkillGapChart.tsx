import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function SkillGapChart() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  // Use real assessment data if available, otherwise fallback to mock data
  const skills = assessmentResult?.skillGaps || [
    { skill: "React", currentLevel: 85, requiredLevel: 95 },
    { skill: "TypeScript", currentLevel: 75, requiredLevel: 90 },
    { skill: "Node.js", currentLevel: 60, requiredLevel: 85 },
    { skill: "System Design", currentLevel: 50, requiredLevel: 80 }
  ];

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Skill Gap Analysis</h3>
      <div className="space-y-4">
        {skills.map((skill: any) => (
          <div key={skill.skill || skill.name}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-body text-foreground">{skill.skill || skill.name}</span>
              <span className="font-body text-muted-foreground">
                {skill.currentLevel || skill.current}% / {skill.requiredLevel || skill.target}%
              </span>
            </div>
            <Progress value={skill.currentLevel || skill.current} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
