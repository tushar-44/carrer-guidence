import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { assessmentCategories } from "@/constants/index";

gsap.registerPlugin(ScrollTrigger);

export function ResultsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const result = useAssessmentStore(state => state.getCurrentResult());

  useEffect(() => {
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        // Animate results cards
        gsap.fromTo(".result-card",
          {
            opacity: 0,
            y: 50,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No assessment results found. Please complete the assessment first.</p>
      </div>
    );
  }

  const topRecommendations = result.recommendations.slice(0, 3);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Your Career Assessment Results
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, here are your personalized career recommendations and insights.
          </p>
        </div>

        {/* Assessment Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {assessmentCategories.map((category) => {
            const categoryData = result.categories[category.value];
            return (
              <Card key={category.value} className="result-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <CardTitle className="text-lg">{category.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={categoryData.percentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-medium">{categoryData.percentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Top Career Recommendations */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl text-foreground text-center mb-8">
            Your Top Career Matches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRecommendations.map((rec) => (
              <Card key={rec.id} className="result-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rec.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {rec.matchPercentage}% Match
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{rec.description}</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Salary Range</span>
                      <span className="font-medium">{rec.salaryRange}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Growth</span>
                      <span className="font-medium">{rec.growthPotential}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.requiredSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Explore This Career
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl text-foreground text-center mb-8">
            Skills to Develop
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {result.skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{gap.skill}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Current: Level {gap.currentLevel}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          Target: Level {gap.requiredLevel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {gap.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Learn
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Roadmap */}
        <div className="mb-16">
          <h3 className="font-heading text-2xl text-foreground text-center mb-8">
            Your Learning Roadmap
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {result.roadmap.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading text-lg text-foreground mb-2">{step.title}</h4>
                      <p className="text-muted-foreground mb-3">{step.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duration: {step.duration}</span>
                        <Button size="sm" variant="outline">
                          View Resources
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h3 className="font-heading text-2xl text-foreground mb-4">
                Ready to Take the Next Step?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Connect with mentors, explore job opportunities, and start building your career roadmap today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Find a Mentor
                </Button>
                <Button size="lg" variant="outline">
                  Browse Jobs
                </Button>
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
