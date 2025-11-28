import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
}

export function SkillGapChart() {
  const { user } = useAuth();
  const { getCurrentResult } = useAssessmentStore();
  const [skills, setSkills] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSkillGapData();
    } else {
      // Use assessment store or fallback to mock data
      const assessmentResult = getCurrentResult();
      if (assessmentResult?.skillGaps) {
        setSkills(assessmentResult.skillGaps);
      } else {
        setSkills([
          { skill: "React", currentLevel: 85, requiredLevel: 95 },
          { skill: "TypeScript", currentLevel: 75, requiredLevel: 90 },
          { skill: "Node.js", currentLevel: 60, requiredLevel: 85 },
          { skill: "System Design", currentLevel: 50, requiredLevel: 80 }
        ]);
      }
      setLoading(false);
    }
  }, [user, getCurrentResult]);

  const fetchSkillGapData = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('results')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data?.results?.skillScores) {
        // Convert skill scores to skill gaps
        const skillGaps: SkillGap[] = Object.entries(data.results.skillScores).map(([skill, score]) => ({
          skill,
          currentLevel: score as number,
          requiredLevel: Math.min((score as number) + 15, 100) // Target is current + 15 or max 100
        }));
        setSkills(skillGaps);
      } else {
        // Fallback to assessment store or mock data
        const assessmentResult = getCurrentResult();
        if (assessmentResult?.skillGaps) {
          setSkills(assessmentResult.skillGaps);
        } else {
          setSkills([
            { skill: "React", currentLevel: 85, requiredLevel: 95 },
            { skill: "TypeScript", currentLevel: 75, requiredLevel: 90 },
            { skill: "Node.js", currentLevel: 60, requiredLevel: 85 },
            { skill: "System Design", currentLevel: 50, requiredLevel: 80 }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching skill gap data:', error);
      // Fallback to assessment store or mock data
      const assessmentResult = getCurrentResult();
      if (assessmentResult?.skillGaps) {
        setSkills(assessmentResult.skillGaps);
      } else {
        setSkills([
          { skill: "React", currentLevel: 85, requiredLevel: 95 },
          { skill: "TypeScript", currentLevel: 75, requiredLevel: 90 },
          { skill: "Node.js", currentLevel: 60, requiredLevel: 85 },
          { skill: "System Design", currentLevel: 50, requiredLevel: 80 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bento-no-min h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Skill Gap Analysis</h3>
      <div className="space-y-4">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Take an assessment to see your skill gaps!
          </p>
        ) : (
          skills.map((skill) => (
            <div key={skill.skill}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-body text-foreground">{skill.skill}</span>
                <span className="font-body text-muted-foreground">
                  {skill.currentLevel}% / {skill.requiredLevel}%
                </span>
              </div>
              <div className="relative">
                <Progress value={skill.currentLevel} className="h-2" />
                {/* Target indicator */}
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-primary/50"
                  style={{ left: `${skill.requiredLevel}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Current</span>
                <span>Gap: {skill.requiredLevel - skill.currentLevel}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}