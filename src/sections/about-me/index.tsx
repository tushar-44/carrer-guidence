import { useState, useEffect } from 'react';
import { SimpleTextCard } from './simple-text-card';
import { AchievementCard } from './achievement-card';
import { FeatureCard } from './feature-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Import SVG assets
import zapIcon from '../../assets/zapIcon.svg';
import rocketIcon from '../../assets/rocketIcon.svg';

// Dashboard Widget Components
interface SkillData {
  name: string;
  current: number;
  target: number;
}

interface AssessmentData {
  results?: {
    skillScores?: Record<string, number>;
  };
}

function SkillGapChart({ assessmentData }: { assessmentData?: AssessmentData }) {
  // Use assessment data if available, otherwise fallback to default skills
  const skills: SkillData[] = assessmentData?.results?.skillScores
    ? Object.entries(assessmentData.results.skillScores).map(([skill, score]) => ({
        name: skill,
        current: score as number,
        target: Math.min((score as number) + 15, 100) // Assume target is current + 15 or 100 max
      }))
    : [
        { name: "React", current: 85, target: 95 },
        { name: "TypeScript", current: 75, target: 90 },
        { name: "Node.js", current: 60, target: 85 },
        { name: "System Design", current: 50, target: 80 }
      ];

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Skill Gap Analysis</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-body text-foreground">{skill.name}</span>
              <span className="font-body text-muted-foreground">{skill.current}% / {skill.target}%</span>
            </div>
            <Progress value={skill.current} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingSessions() {
  const sessions = [
    { mentor: "Sarah Chen", topic: "React Best Practices", date: "Tomorrow, 2:00 PM" },
    { mentor: "Marcus Rodriguez", topic: "Product Strategy", date: "Dec 28, 4:00 PM" },
    { mentor: "Dr. Emily Watson", topic: "ML Fundamentals", date: "Dec 30, 10:00 AM" }
  ];

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Upcoming Sessions</h3>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-foreground">{session.topic}</p>
              <p className="font-body text-xs text-muted-foreground">with {session.mentor}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{session.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendedCourses() {
  const courses = [
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

function ProfileSummary() {
  const { profile } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bento-no-min h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
        <span className="font-heading text-3xl text-primary-foreground">
          {getInitials(profile?.full_name)}
        </span>
      </div>
      <h3 className="font-heading text-2xl text-foreground mb-2">
        {profile?.full_name || "User"}
      </h3>
      <p className="font-body text-sm text-muted-foreground mb-4 capitalize">
        {profile?.user_type || "Graduate"}
      </p>
      <div className="flex gap-2">
        <Badge variant="outline">Career</Badge>
        <Badge variant="outline">Growth</Badge>
        <Badge variant="outline">Learning</Badge>
      </div>
    </div>
  );
}

function CareerGoalCard() {
  return (
    <div className="bento-no-min h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="font-heading text-xl text-foreground">Current Goal</h3>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Land a Senior Frontend Developer role at a top tech company
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted-foreground">Progress</span>
          <span className="font-body text-foreground font-medium">68%</span>
        </div>
        <Progress value={68} className="h-2" />
      </div>
    </div>
  );
}

export function Dashboard({ assessmentData }: { assessmentData?: AssessmentData }) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // Removed unused useEffect for fetching dashboard data

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1381);
    };

    // Check initial size
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Removed loading and error states since they're now handled in DashboardPage

  if (isLargeScreen) {
    // Original 5x6 bento grid layout for screens >= 1381px
    return (
      <section
        id="dashboard"
        className="py-20 px-6 md:px-12 lg:px-16"
      >
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-body text-lg font-light text-foreground mb-4">
              STUDENT DASHBOARD
            </h2>
            <p className="font-heading text-5xl text-foreground mb-4">
              Your Career Tracking Hub
            </p>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your progress, track achievements, and stay on course with personalized insights and real-time guidance.
            </p>
          </div>
          {/* 5x6 Bento Grid */}
          <div className="grid grid-cols-5 gap-4">

            {/* Column 1, Row 1 - Profile Summary */}
            <ProfileSummary />

            {/* Column 2, Rows 1-2 - Assessments Completed */}
            <AchievementCard
              title={<>Assessments<br />Completed</>}
              description="3 of 5 completed"
              className="row-span-2"
              value={3}
              suffix="/5"
            />

            {/* Column 3, Rows 1-2 - Learning Hours */}
            <AchievementCard
              title={<>Learning<br />Hours<br />This Month</>}
              description="24 hours logged"
              className="row-span-2"
              value={24}
              suffix="h"
            />

            {/* Column 4, Rows 1-2 - Career Goals */}
            <AchievementCard
              title={<>Skills<br />Mastered</>}
              description="8 new skills"
              className="row-span-2"
              value={8}
            />

            {/* Column 5, Rows 1-3 - Current Goal */}
            <div className="row-span-3">
              <CareerGoalCard />
            </div>

            {/* Column 1, Row 2 - Progress Indicator */}
            <div className="flex items-center justify-center bento-no-min h-36">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-body text-sm text-muted-foreground">On Track</p>
              </div>
            </div>

            {/* Column 1, Rows 3-6 - Skill Gap Chart */}
            <div className="row-span-4">
              <SkillGapChart assessmentData={assessmentData} />
            </div>

            {/* Columns 2-4, Rows 3-5 - Upcoming Sessions */}
            <div className="col-span-3 row-span-3">
              <UpcomingSessions />
            </div>

            {/* Column 5, Row 4 - Skill Development */}
            <FeatureCard
              icon={zapIcon}
              text={<>Skill<br/>Development</>}
              altText="Skill Development"
              variant="text-left-icon-right"
            />

            {/* Column 5, Row 5 - Goal Achievement */}
            <FeatureCard
              icon={rocketIcon}
              text={<>Goal<br/>Achievement</>}
              altText="Goal Achievement"
              variant="text-right-icon-left"
            />

            {/* Columns 2-4, Row 6 - Recommended Courses */}
            <div className="col-span-3">
              <RecommendedCourses />
            </div>

            {/* Column 5, Row 6 - Career Milestones */}
            <SimpleTextCard text="Milestones" />
            
          </div>
        </div>
      </section>
    );
  }

  // Compact layout for screens < 1381px
  return (
    <section
      id="dashboard"
      className="py-20 px-6 md:px-12 lg:px-16"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-body text-lg font-light text-foreground mb-4">
            STUDENT DASHBOARD
          </h2>
          <p className="font-heading text-5xl text-foreground mb-4">
            Your Career Tracking Hub
          </p>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor your progress, track achievements, and stay on course with personalized insights and real-time guidance.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          
          {/* Row 1: 3 AchievementCards */}
          <div className="grid grid-cols-3 gap-4">
            <AchievementCard
              title={<>Assessments<br />Completed</>}
              description="3 of 5 completed"
              value={3}
              suffix="/5"
            />
            <AchievementCard
              title={<>Learning<br />Hours<br />This Month</>}
              description="24 hours logged"
              value={24}
              suffix="h"
            />
            <AchievementCard
              title={<>Skills<br />Mastered</>}
              description="8 new skills"
              value={8}
            />
          </div>

          {/* Row 2: Profile Summary */}
          <div className="w-full">
            <ProfileSummary />
          </div>

          {/* Row 3: 2 FeatureCards + 1 SimpleTextCard */}
          <div className="flex flex-col gap-4">
            {/* FeatureCards row */}
            <div className="grid grid-cols-2 [@media(min-width:1175px)]:grid-cols-3 gap-4">
              <FeatureCard
                icon={rocketIcon}
                text={<>Goal<br/>Achievement</>}
                altText="Goal Achievement"
                variant="text-right-icon-left"
              />
              <FeatureCard
                icon={zapIcon}
                text={<>Skill<br/>Development</>}
                altText="Skill Development"
                variant="text-left-icon-right"
              />
              {/* SimpleTextCard only shows in this row on screens >= 1175px */}
              <div className="hidden [@media(min-width:1175px)]:block">
                <SimpleTextCard text="Career Milestones" />
              </div>
            </div>
            
            {/* SimpleTextCard on its own row for screens < 1175px */}
            <div className="[@media(min-width:1175px)]:hidden">
              <SimpleTextCard text="Career Milestones" />
            </div>
          </div>

          {/* Row 4: Upcoming Sessions */}
          <div className="w-full">
            <UpcomingSessions />
          </div>

          {/* Row 5: Skill Gap Chart */}
          <div className="w-full">
            <SkillGapChart assessmentData={assessmentData} />
          </div>

          {/* Row 6: Recommended Courses */}
          <div className="w-full">
            <RecommendedCourses />
          </div>

        </div>
      </div>
    </section>
  );
}