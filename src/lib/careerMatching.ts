import { calculateCareerMatches } from '@/data/careers';
import { getRecommendedCourses, getRoadmapForCareer, type Course } from '@/data/courses';
import type { CareerRecommendation, SkillGap, RoadmapStep } from '@/constants/index';

export interface CareerMatchResult {
  careers: CareerRecommendation[];
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
  recommendedCourses: Course[];
}

export interface AssessmentScores {
  aptitude: number;
  interests: number;
  personality: number;
  emotionalIntelligence: number;
  skillsReadiness: number;
}

export interface UserProfile {
  interests: string[];
  userType: string;
  currentSkills: string[];
  experience: string;
  education: string;
}

/**
 * Enhanced career matching algorithm that considers multiple factors
 */
export function calculateEnhancedCareerMatches(
  assessmentScores: AssessmentScores,
  userProfile: UserProfile
): CareerRecommendation[] {
  const baseMatches = calculateCareerMatches(assessmentScores);

  // Apply user profile adjustments
  const adjustedMatches = baseMatches.map(career => {
    let adjustedScore = career.matchPercentage || 0;

    // Interest alignment bonus
    const interestMatch = career.requiredSkills.some(skill =>
      userProfile.interests.some(interest =>
        interest.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (interestMatch) adjustedScore += 10;

    // User type adjustments
    switch (userProfile.userType) {
      case 'class-8-9':
        // Focus on entry-level, educational careers
        if (career.title.includes('Engineer') || career.title.includes('Scientist')) {
          adjustedScore += 5;
        }
        break;
      case 'class-10-12':
        // Balance between technical and creative careers
        adjustedScore += 3;
        break;
      case 'graduates':
        // Higher weight for professional careers
        if (career.salaryRange.includes('$100,000') || career.growthPotential === 'Very High') {
          adjustedScore += 8;
        }
        break;
      case 'job-seeker':
        // Focus on immediate employability
        if (career.growthPotential === 'Very High' || career.growthPotential === 'High') {
          adjustedScore += 5;
        }
        break;
    }

    // Experience level adjustments
    if (userProfile.experience === 'entry' && career.title.includes('Senior')) {
      adjustedScore -= 15;
    }
    if (userProfile.experience === 'senior' && !career.title.includes('Senior')) {
      adjustedScore -= 10;
    }

    return {
      ...career,
      matchPercentage: Math.min(100, Math.max(0, Math.round(adjustedScore)))
    };
  });

  return adjustedMatches.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
}

/**
 * Calculate skill gaps based on career requirements and user skills
 */
export function calculateSkillGaps(
  targetCareer: CareerRecommendation,
  userSkills: string[]
): SkillGap[] {
  const skillGaps: SkillGap[] = [];

  targetCareer.requiredSkills.forEach(skill => {
    const hasSkill = userSkills.some(userSkill =>
      userSkill.toLowerCase() === skill.toLowerCase()
    );

    const currentLevel = hasSkill ? 70 + Math.random() * 30 : 20 + Math.random() * 40;
    const requiredLevel = 80 + Math.random() * 20;

    const gap = requiredLevel - currentLevel;
    let priority: 'high' | 'medium' | 'low' = 'medium';

    if (gap > 30) priority = 'high';
    else if (gap < 10) priority = 'low';

    skillGaps.push({
      skill,
      currentLevel: Math.round(currentLevel),
      requiredLevel: Math.round(requiredLevel),
      gap: Math.round(gap),
      priority
    });
  });

  return skillGaps.sort((a, b) => b.gap - a.gap);
}

/**
 * Generate personalized learning roadmap
 */
export function generatePersonalizedRoadmap(
  career: CareerRecommendation,
  skillGaps: SkillGap[]
): RoadmapStep[] {
  const baseRoadmap = getRoadmapForCareer(career.id.toLowerCase().replace(/\s+/g, '-'));

  if (baseRoadmap.length > 0) {
    return baseRoadmap;
  }

  // Generate dynamic roadmap based on skill gaps
  const roadmap: RoadmapStep[] = [];
  const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'high');

  // Foundation phase
  roadmap.push({
    id: 'foundation',
    title: 'Build Foundation Skills',
    description: 'Master the core skills required for this career path',
    duration: '3-6 months',
    resources: highPriorityGaps.slice(0, 3).map(gap => ({
      type: 'course' as const,
      title: `${gap.skill} Fundamentals Course`,
      platform: 'Coursera/Udemy',
      url: '#'
    })),
    completed: false
  });

  // Intermediate phase
  roadmap.push({
    id: 'intermediate',
    title: 'Develop Intermediate Skills',
    description: 'Build upon foundation skills with more advanced concepts',
    duration: '4-8 months',
    resources: [
      {
        type: 'project',
        title: 'Build Portfolio Projects',
        url: '#'
      },
      {
        type: 'mentorship',
        title: 'Connect with Industry Mentors'
      }
    ],
    completed: false
  });

  // Advanced phase
  roadmap.push({
    id: 'advanced',
    title: 'Master Advanced Concepts',
    description: 'Tackle complex challenges and specialize in your chosen area',
    duration: '6-12 months',
    resources: [
      {
        type: 'course',
        title: 'Advanced Topics and Specializations',
        platform: 'Specialized Platforms'
      },
      {
        type: 'project',
        title: 'Contribute to Open Source or Real Projects'
      }
    ],
    completed: false
  });

  // Career preparation phase
  roadmap.push({
    id: 'career-prep',
    title: 'Career Preparation',
    description: 'Prepare for job applications and interviews',
    duration: '2-4 months',
    resources: [
      {
        type: 'mentorship',
        title: 'Mock Interviews and Resume Review'
      },
      {
        type: 'project',
        title: 'Create Professional Portfolio'
      }
    ],
    completed: false
  });

  return roadmap;
}

/**
 * Get comprehensive career recommendations with all related data
 */
export function getComprehensiveCareerRecommendations(
  assessmentScores: AssessmentScores,
  userProfile: UserProfile
): CareerMatchResult {
  const matchedCareers = calculateEnhancedCareerMatches(assessmentScores, userProfile);
  const topCareer = matchedCareers[0];

  const skillGaps = calculateSkillGaps(topCareer, userProfile.currentSkills);
  const roadmap = generatePersonalizedRoadmap(topCareer, skillGaps);

  // Get recommended courses based on skill gaps
  const skillsToLearn = skillGaps.map(gap => gap.skill);
  const recommendedCourses = getRecommendedCourses(skillsToLearn, 6);

  return {
    careers: matchedCareers.slice(0, 5), // Top 5 matches
    skillGaps,
    roadmap,
    recommendedCourses
  };
}

/**
 * Calculate career transition difficulty
 */
export function calculateTransitionDifficulty(
  currentCareer: string | null,
  targetCareer: CareerRecommendation,
  userSkills: string[]
): {
  difficulty: 'easy' | 'moderate' | 'challenging';
  timeEstimate: string;
  keyChallenges: string[];
} {
  if (!currentCareer) {
    return {
      difficulty: 'moderate',
      timeEstimate: '6-12 months',
      keyChallenges: ['Building foundational skills', 'Gaining relevant experience']
    };
  }

  const skillMatch = targetCareer.requiredSkills.filter(skill =>
    userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
  ).length;

  const matchPercentage = (skillMatch / targetCareer.requiredSkills.length) * 100;

  if (matchPercentage > 70) {
    return {
      difficulty: 'easy',
      timeEstimate: '3-6 months',
      keyChallenges: ['Gaining specific domain experience']
    };
  } else if (matchPercentage > 40) {
    return {
      difficulty: 'moderate',
      timeEstimate: '6-12 months',
      keyChallenges: ['Learning new technical skills', 'Building portfolio']
    };
  } else {
    return {
      difficulty: 'challenging',
      timeEstimate: '12-24 months',
      keyChallenges: ['Major skill gap', 'Complete career change', 'Building network']
    };
  }
}
