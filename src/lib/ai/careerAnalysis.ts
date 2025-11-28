// AI-Powered Career Analysis
import { openai, checkOpenAIAvailability } from './openai';
import type { AssessmentCategory } from '@/constants/index';

interface AssessmentData {
  categories: Record<AssessmentCategory, {
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  answers: any[];
}

interface CareerAnalysisResult {
  recommendations: Array<{
    title: string;
    description: string;
    matchPercentage: number;
    requiredSkills: string[];
    salaryRange: string;
    growthPotential: string;
    reasoning: string;
  }>;
  skillGaps: Array<{
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  aiInsights: string;
}

export async function analyzeCareerPath(
  assessmentData: AssessmentData,
  userGoals?: string
): Promise<CareerAnalysisResult> {
  if (!checkOpenAIAvailability() || !openai) {
    // Return fallback recommendations
    return getFallbackRecommendations();
  }

  try {
    const prompt = `You are a career counselor AI. Analyze the following assessment results and provide personalized career recommendations.

Assessment Scores:
${Object.entries(assessmentData.categories).map(([category, data]) => 
  `- ${category}: ${data.percentage}%`
).join('\n')}

${userGoals ? `User's Career Goals: ${userGoals}` : ''}

Provide a JSON response with:
1. Top 3 career recommendations with match percentages, required skills, salary ranges, and growth potential
2. Top 5 skill gaps to address
3. Overall career insights

Format:
{
  "recommendations": [
    {
      "title": "Career Title",
      "description": "Brief description",
      "matchPercentage": 85,
      "requiredSkills": ["skill1", "skill2"],
      "salaryRange": "$X - $Y",
      "growthPotential": "High/Medium/Low",
      "reasoning": "Why this career fits"
    }
  ],
  "skillGaps": [
    {
      "skill": "Skill name",
      "currentLevel": 3,
      "requiredLevel": 5,
      "gap": 2,
      "priority": "high"
    }
  ],
  "aiInsights": "Overall analysis and recommendations"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor. Provide detailed, actionable career guidance based on assessment results.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result as CareerAnalysisResult;
  } catch (error) {
    console.error('Error analyzing career path:', error);
    return getFallbackRecommendations();
  }
}

function getFallbackRecommendations(): CareerAnalysisResult {
  return {
    recommendations: [
      {
        title: 'Software Engineer',
        description: 'Design and develop software applications using various programming languages and frameworks.',
        matchPercentage: 85,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'Problem Solving'],
        salaryRange: '$70,000 - $150,000',
        growthPotential: 'High',
        reasoning: 'Strong technical aptitude and problem-solving skills'
      },
      {
        title: 'Data Analyst',
        description: 'Analyze complex datasets to help organizations make informed decisions.',
        matchPercentage: 78,
        requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
        salaryRange: '$60,000 - $120,000',
        growthPotential: 'High',
        reasoning: 'Good analytical skills and attention to detail'
      },
      {
        title: 'UX Designer',
        description: 'Create intuitive and beautiful user experiences for digital products.',
        matchPercentage: 72,
        requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        salaryRange: '$65,000 - $130,000',
        growthPotential: 'Medium',
        reasoning: 'Creative thinking and user empathy'
      }
    ],
    skillGaps: [
      {
        skill: 'Advanced JavaScript',
        currentLevel: 3,
        requiredLevel: 5,
        gap: 2,
        priority: 'high'
      },
      {
        skill: 'Data Structures & Algorithms',
        currentLevel: 2,
        requiredLevel: 4,
        gap: 2,
        priority: 'high'
      },
      {
        skill: 'System Design',
        currentLevel: 1,
        requiredLevel: 3,
        gap: 2,
        priority: 'medium'
      },
      {
        skill: 'Cloud Technologies',
        currentLevel: 2,
        requiredLevel: 4,
        gap: 2,
        priority: 'medium'
      },
      {
        skill: 'Communication Skills',
        currentLevel: 3,
        requiredLevel: 4,
        gap: 1,
        priority: 'low'
      }
    ],
    aiInsights: 'Based on your assessment, you show strong potential in technical roles. Focus on building your programming fundamentals and problem-solving skills. Consider starting with web development or data analysis as entry points into the tech industry.'
  };
}