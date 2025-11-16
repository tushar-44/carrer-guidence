import { calculateCategoryScore } from '@/data/assessments';
import { getTopCareerRecommendations } from '@/data/careers';

export interface AssessmentResults {
  categoryScores: {
    aptitude: number;
    interests: number;
    personality: number;
    emotionalIntelligence: number;
    skillsReadiness: number;
  };
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  careerRecommendations: ReturnType<typeof getTopCareerRecommendations>;
  personalityTraits: {
    trait: string;
    score: number;
  }[];
}

export const calculateAssessmentResults = (
  answers: Record<string, number>
): AssessmentResults => {
  // Calculate scores for each category
  const categoryScores = {
    aptitude: calculateCategoryScore(answers, 'aptitude'),
    interests: calculateCategoryScore(answers, 'interests'),
    personality: calculateCategoryScore(answers, 'personality'),
    emotionalIntelligence: calculateCategoryScore(answers, 'emotional-intelligence'),
    skillsReadiness: calculateCategoryScore(answers, 'skills-readiness')
  };

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 5
  );

  // Identify strengths (scores >= 70)
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  Object.entries(categoryScores).forEach(([category, score]) => {
    const categoryName = category
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/^./, str => str.toUpperCase());
    
    if (score >= 70) {
      strengths.push(categoryName);
    } else if (score < 50) {
      weaknesses.push(categoryName);
    }
  });

  // Get career recommendations
  const careerRecommendations = getTopCareerRecommendations(categoryScores, 5);

  // Extract personality traits (simplified)
  const personalityTraits = [
    { trait: 'Analytical Thinking', score: categoryScores.aptitude },
    { trait: 'Creativity', score: categoryScores.interests },
    { trait: 'Adaptability', score: categoryScores.personality },
    { trait: 'Emotional Intelligence', score: categoryScores.emotionalIntelligence },
    { trait: 'Technical Skills', score: categoryScores.skillsReadiness }
  ];

  return {
    categoryScores,
    overallScore,
    strengths,
    weaknesses,
    careerRecommendations,
    personalityTraits
  };
};