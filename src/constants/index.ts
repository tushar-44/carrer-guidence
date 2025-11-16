export type NavigationItem = {
  name: string;
  link: string;
  mobileLink: string;
};

export const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    link: "/",
    mobileLink: "/"
  },
  {
    name: "Mentors",
    link: "/mentors",
    mobileLink: "/mentors"
  },
  {
    name: "Assessment",
    link: "/assessment",
    mobileLink: "/assessment"
  },
  {
    name: "Jobs",
    link: "/jobs",
    mobileLink: "/jobs"
  },
  {
    name: "Login",
    link: "/login",
    mobileLink: "/login"
  },
  {
    name: "Dashboard",
    link: "/dashboard",
    mobileLink: "/dashboard"
  },
  {
    name: "Admin Panel",
    link: "/admin-panel",
    mobileLink: "/admin-panel"
  }
];

// User Types (aligned with database schema)
export type UserType =
  | "graduates"
  | "mentor"
  | "company";

export const userTypes: { value: UserType; label: string; description: string }[] = [
  {
    value: "graduates",
    label: "Graduates & Job Seekers",
    description: "Career transition, job search, and professional development"
  },
  {
    value: "mentor",
    label: "Mentors & Counselors",
    description: "Industry experts sharing knowledge and guidance"
  },
  {
    value: "company",
    label: "Companies & Recruiters",
    description: "Post jobs and find talent for your organization"
  }
];

// Assessment Categories
export type AssessmentCategory =
  | "aptitude"
  | "interests"
  | "personality"
  | "emotional-intelligence"
  | "skills-readiness";

export const assessmentCategories: { value: AssessmentCategory; label: string; description: string; icon: string }[] = [
  {
    value: "aptitude",
    label: "Aptitude",
    description: "Test your natural abilities and cognitive strengths",
    icon: "🧠"
  },
  {
    value: "interests",
    label: "Interests",
    description: "Discover what truly motivates and excites you",
    icon: "❤️"
  },
  {
    value: "personality",
    label: "Personality",
    description: "Understand your behavioral patterns and preferences",
    icon: "👤"
  },
  {
    value: "emotional-intelligence",
    label: "Emotional Intelligence",
    description: "Assess your social and emotional awareness",
    icon: "🤝"
  },
  {
    value: "skills-readiness",
    label: "Skills Readiness",
    description: "Evaluate your current skill level and gaps",
    icon: "⚡"
  }
];

// Career Recommendations
export interface CareerRecommendation {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  salaryRange: string;
  growthPotential: string;
  icon: string;
}

// Skill Gap Analysis
export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: "high" | "medium" | "low";
}

// Learning Roadmap
export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: {
    type: "course" | "book" | "project" | "mentorship";
    title: string;
    url?: string;
    platform?: string;
  }[];
  completed: boolean;
}

// Mentor Filters
export interface MentorFilters {
  stream?: string;
  experience?: string;
  availability?: string;
  rating?: number;
  priceRange?: [number, number];
}

// Job Filters
export interface JobFilters {
  domain?: string;
  skillMatch?: string;
  salaryRange?: [number, number];
  location?: string;
  type?: "full-time" | "part-time" | "internship" | "contract";
}

// Booking Status
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

// Application Status
export type ApplicationStatus = "applied" | "reviewing" | "interview" | "offered" | "rejected";
