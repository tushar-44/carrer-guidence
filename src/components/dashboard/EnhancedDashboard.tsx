import { useState, useEffect } from 'react';
import { SimpleTextCard } from '../../sections/about-me/simple-text-card';
import { FeatureCard } from '../../sections/about-me/feature-card';
import { TrendingUp } from 'lucide-react';

// Import SVG assets
import zapIcon from '../../assets/zapIcon.svg';
import rocketIcon from '../../assets/rocketIcon.svg';

// Import dashboard components
import { ProfileSummary } from './ProfileSummary';
import { SkillGapChart } from './SkillGapChart';
import { UpcomingSessions } from './UpcomingSessions';
import { RecommendedCourses } from './RecommendedCourses';
import { CareerGoalCard } from './CareerGoalCard';
import { LearningHoursCard } from './LearningHoursCard';
import { AssessmentsCompletedCard } from './AssessmentsCompletedCard';
import { SkillsMasteredCard } from './SkillsMasteredCard';

export function EnhancedDashboard() {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

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
            <AssessmentsCompletedCard />

            {/* Column 3, Rows 1-2 - Learning Hours */}
            <LearningHoursCard />

            {/* Column 4, Rows 1-2 - Career Goals */}
            <SkillsMasteredCard />

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
              <SkillGapChart />
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

          {/* Row 1: Achievement Cards */}
          <div className="grid grid-cols-2 gap-4">
            <AssessmentsCompletedCard />
            <LearningHoursCard />
          </div>

          {/* Row 2: More Achievement Cards */}
          <div className="grid grid-cols-2 gap-4">
            <SkillsMasteredCard />
            <CareerGoalCard />
          </div>

          {/* Row 3: Profile Summary */}
          <div className="w-full">
            <ProfileSummary />
          </div>

          {/* Row 4: Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Row 5: Upcoming Sessions */}
          <div className="w-full">
            <UpcomingSessions />
          </div>

          {/* Row 6: Skill Gap Chart */}
          <div className="w-full">
            <SkillGapChart />
          </div>

          {/* Row 7: Recommended Courses */}
          <div className="w-full">
            <RecommendedCourses />
          </div>

        </div>
      </div>
    </section>
  );
}
