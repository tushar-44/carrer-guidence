// AI-Powered Career Roadmap Generator
import { openai, checkOpenAIAvailability } from './openai';

interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  resources: Array<{
    type: 'course' | 'book' | 'project' | 'certification' | 'practice';
    title: string;
    url?: string;
    platform?: string;
  }>;
}

interface CareerRoadmap {
  careerPath: string;
  milestones: RoadmapMilestone[];
  timelineMonths: number;
  aiAnalysis: string;
}

export async function generateCareerRoadmap(
  targetCareer: string,
  currentSkills: string[],
  skillGaps: Array<{ skill: string; gap: number; priority: string }>
): Promise<CareerRoadmap> {
  if (!checkOpenAIAvailability() || !openai) {
    return getFallbackRoadmap(targetCareer);
  }

  try {
    const prompt = `Create a detailed career roadmap for someone wanting to become a ${targetCareer}.

Current Skills: ${currentSkills.join(', ')}

Skill Gaps to Address:
${skillGaps.map(gap => `- ${gap.skill} (Priority: ${gap.priority})`).join('\n')}

Provide a JSON response with a step-by-step learning roadmap including:
1. Milestones (6-8 steps)
2. Duration for each milestone
3. Recommended resources (courses, books, projects)
4. Overall timeline in months
5. Strategic analysis

Format:
{
  "careerPath": "${targetCareer}",
  "milestones": [
    {
      "id": "1",
      "title": "Milestone title",
      "description": "What to achieve",
      "duration": "4 weeks",
      "completed": false,
      "resources": [
        {
          "type": "course",
          "title": "Resource name",
          "url": "https://...",
          "platform": "Platform name"
        }
      ]
    }
  ],
  "timelineMonths": 12,
  "aiAnalysis": "Strategic roadmap analysis"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor creating personalized learning roadmaps. Provide practical, actionable steps with real resources.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result as CareerRoadmap;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return getFallbackRoadmap(targetCareer);
  }
}

function getFallbackRoadmap(careerPath: string): CareerRoadmap {
  return {
    careerPath,
    milestones: [
      {
        id: '1',
        title: 'Master Fundamentals',
        description: 'Build a strong foundation in core concepts and technologies',
        duration: '8 weeks',
        completed: false,
        resources: [
          {
            type: 'course',
            title: 'Complete Programming Fundamentals',
            url: 'https://www.udemy.com',
            platform: 'Udemy'
          },
          {
            type: 'book',
            title: 'Clean Code by Robert Martin',
            url: 'https://www.amazon.com'
          }
        ]
      },
      {
        id: '2',
        title: 'Learn Core Technologies',
        description: 'Master the essential tools and frameworks for your career path',
        duration: '12 weeks',
        completed: false,
        resources: [
          {
            type: 'course',
            title: 'Advanced Framework Course',
            url: 'https://www.coursera.org',
            platform: 'Coursera'
          },
          {
            type: 'practice',
            title: 'Build 3 Portfolio Projects',
            url: 'https://github.com'
          }
        ]
      },
      {
        id: '3',
        title: 'Build Real Projects',
        description: 'Apply your knowledge by building practical applications',
        duration: '8 weeks',
        completed: false,
        resources: [
          {
            type: 'project',
            title: 'Full-Stack Application',
            url: 'https://github.com'
          },
          {
            type: 'project',
            title: 'Open Source Contribution',
            url: 'https://github.com'
          }
        ]
      },
      {
        id: '4',
        title: 'Get Certified',
        description: 'Earn industry-recognized certifications',
        duration: '4 weeks',
        completed: false,
        resources: [
          {
            type: 'certification',
            title: 'Professional Certification',
            url: 'https://www.certification-provider.com'
          }
        ]
      },
      {
        id: '5',
        title: 'Gain Experience',
        description: 'Internships, freelance projects, or entry-level positions',
        duration: '12 weeks',
        completed: false,
        resources: [
          {
            type: 'practice',
            title: 'Freelance Projects',
            url: 'https://www.upwork.com'
          },
          {
            type: 'practice',
            title: 'Internship Opportunities',
            url: 'https://www.linkedin.com'
          }
        ]
      },
      {
        id: '6',
        title: 'Advanced Skills',
        description: 'Specialize in advanced topics and emerging technologies',
        duration: '8 weeks',
        completed: false,
        resources: [
          {
            type: 'course',
            title: 'Advanced Specialization',
            url: 'https://www.edx.org',
            platform: 'edX'
          }
        ]
      }
    ],
    timelineMonths: 12,
    aiAnalysis: `This roadmap is designed to take you from your current skill level to a professional ${careerPath} role in approximately 12 months. Focus on building strong fundamentals, creating a portfolio of projects, and gaining practical experience. Adjust the timeline based on your learning pace and availability.`
  };
}