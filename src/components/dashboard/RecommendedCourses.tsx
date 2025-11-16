import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/stores/assessmentStore';

export function RecommendedCourses() {
  const { getCurrentResult } = useAssessmentStore();
  const assessmentResult = getCurrentResult();

  // Use real assessment data if available, otherwise fallback to mock data
  const courses = assessmentResult?.roadmap?.slice(0, 3).map(step => ({
    title: step.title,
    provider: step.resources[0]?.platform || "Online Platform",
    progress: step.completed ? 100 : Math.floor(Math.random() * 50) // Mock progress for incomplete steps
  })) || [
    { title: "Advanced React Patterns", provider: "Frontend Masters", progress: 45 },
    { title: "System Design Interview", provider: "Educative", progress: 20 },
    { title: "TypeScript Deep Dive", provider: "Udemy", progress: 0 }
  ];

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Recommended Courses</h3>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground">{course.title}</p>
                <p className="font-body text-xs text-muted-foreground">{course.provider}</p>
              </div>
              {course.progress > 0 && (
                <Badge variant="secondary" className="text-xs ml-2">
                  {course.progress}%
                </Badge>
              )}
            </div>
            {course.progress > 0 && <Progress value={course.progress} className="h-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
