// AI-powered assessment generation using OpenAI
import { supabase } from '@/lib/supabase';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale';
  options: string[];
  category: string;
  weight: number;
}

interface GenerateQuestionsParams {
  interests?: string[];
  previousAnswers?: Record<string, any>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Generate adaptive assessment questions using OpenAI
 */
export async function generateAssessmentQuestions(
  params: GenerateQuestionsParams
): Promise<AssessmentQuestion[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    // Call the AI edge function to generate questions
    const response = await fetch(`${supabaseUrl}/functions/v1/ai/generate-questions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interests: params.interests || [],
        previousAnswers: params.previousAnswers || {},
        difficulty: params.difficulty || 'intermediate',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    // Fallback to static questions if AI fails
    return getStaticQuestions();
  }
}

/**
 * Analyze assessment results using AI
 */
export async function analyzeAssessmentResults(
  answers: Record<string, any>,
  userId: string
): Promise<{
  careerRecommendations: any[];
  skillGaps: any[];
  roadmap: any[];
  insights: string;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/ai/analyze-assessment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze assessment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing assessment:', error);
    throw error;
  }
}

/**
 * Fallback static questions when AI is unavailable
 */
function getStaticQuestions(): AssessmentQuestion[] {
  return [
    {
      id: 'q1',
      question: 'What type of work environment do you prefer?',
      type: 'single',
      options: [
        'Fast-paced startup',
        'Established corporation',
        'Remote/Freelance',
        'Non-profit organization'
      ],
      category: 'work-preference',
      weight: 1
    },
    {
      id: 'q2',
      question: 'Which skills are you most interested in developing?',
      type: 'multiple',
      options: [
        'Programming & Software Development',
        'Data Analysis & Statistics',
        'Design & Creativity',
        'Business & Management',
        'Communication & Writing'
      ],
      category: 'skills-interest',
      weight: 2
    },
    {
      id: 'q3',
      question: 'How comfortable are you with public speaking?',
      type: 'scale',
      options: ['1', '2', '3', '4', '5'],
      category: 'soft-skills',
      weight: 1
    },
    {
      id: 'q4',
      question: 'What motivates you most in your career?',
      type: 'single',
      options: [
        'Financial stability',
        'Creative expression',
        'Helping others',
        'Innovation & technology',
        'Leadership & influence'
      ],
      category: 'motivation',
      weight: 2
    },
    {
      id: 'q5',
      question: 'How do you prefer to learn new skills?',
      type: 'multiple',
      options: [
        'Hands-on practice',
        'Reading documentation',
        'Video tutorials',
        'Mentorship',
        'Formal courses'
      ],
      category: 'learning-style',
      weight: 1
    }
  ];
}

/**
 * Calculate assessment score based on answers
 */
export function calculateAssessmentScore(
  answers: Record<string, any>,
  questions: AssessmentQuestion[]
): {
  totalScore: number;
  categoryScores: Record<string, number>;
  percentage: number;
} {
  let totalScore = 0;
  let maxScore = 0;
  const categoryScores: Record<string, { score: number; max: number }> = {};

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    const weight = question.weight || 1;
    maxScore += weight * 5;

    let score = 0;
    if (question.type === 'scale') {
      score = parseInt(answer) * weight;
    } else if (question.type === 'single') {
      score = 5 * weight; // Full points for answering
    } else if (question.type === 'multiple') {
      score = Math.min(answer.length * 2, 5) * weight;
    }

    totalScore += score;

    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { score: 0, max: 0 };
    }
    categoryScores[question.category].score += score;
    categoryScores[question.category].max += weight * 5;
  });

  const categoryPercentages: Record<string, number> = {};
  Object.entries(categoryScores).forEach(([category, { score, max }]) => {
    categoryPercentages[category] = Math.round((score / max) * 100);
  });

  return {
    totalScore,
    categoryScores: categoryPercentages,
    percentage: Math.round((totalScore / maxScore) * 100),
  };
}