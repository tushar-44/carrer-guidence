import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { assessmentsService } from '@/lib/supabase-services';
import { supabase } from '@/lib/supabase';
import type {
  AssessmentCategory,
  CareerRecommendation,
  SkillGap,
  RoadmapStep
} from '@/constants/index';

interface AssessmentAnswer {
  questionId: string;
  category: AssessmentCategory;
  answer: number; // 1-5 scale
  timestamp: Date;
}

interface AssessmentResult {
  id: string;
  userId: string;
  completedAt: Date;
  categories: Record<AssessmentCategory, {
    score: number;
    maxScore: number;
    percentage: number;
  }>;
  recommendations: CareerRecommendation[];
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
}

interface AssessmentState {
  currentAssessment: {
    answers: AssessmentAnswer[];
    currentCategory: AssessmentCategory | null;
    currentQuestionIndex: number;
    isCompleted: boolean;
  };
  results: AssessmentResult[];
  isLoading: boolean;
}

interface AssessmentActions {
  startAssessment: () => void;
  answerQuestion: (questionId: string, category: AssessmentCategory, answer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeAssessment: () => Promise<void>;
  resetAssessment: () => void;
  setLoading: (loading: boolean) => void;
  getCurrentResult: () => AssessmentResult | null;
}

type AssessmentStore = AssessmentState & AssessmentActions;

// Mock assessment questions
export const mockQuestions = {
  aptitude: [
    { id: 'apt1', text: 'I enjoy solving complex mathematical problems', category: 'aptitude' as AssessmentCategory },
    { id: 'apt2', text: 'I can quickly learn new technical concepts', category: 'aptitude' as AssessmentCategory },
    { id: 'apt3', text: 'I prefer working with data and patterns', category: 'aptitude' as AssessmentCategory },
  ],
  interests: [
    { id: 'int1', text: 'I enjoy helping others solve their problems', category: 'interests' as AssessmentCategory },
    { id: 'int2', text: 'I like creating visual designs and artwork', category: 'interests' as AssessmentCategory },
    { id: 'int3', text: 'I prefer working with technology and coding', category: 'interests' as AssessmentCategory },
  ],
  personality: [
    { id: 'per1', text: 'I work well in team environments', category: 'personality' as AssessmentCategory },
    { id: 'per2', text: 'I prefer independent work with minimal supervision', category: 'personality' as AssessmentCategory },
    { id: 'per3', text: 'I enjoy taking leadership roles', category: 'personality' as AssessmentCategory },
  ],
  'emotional-intelligence': [
    { id: 'eq1', text: 'I can understand and manage my own emotions effectively', category: 'emotional-intelligence' as AssessmentCategory },
    { id: 'eq2', text: 'I can empathize with others\' feelings and perspectives', category: 'emotional-intelligence' as AssessmentCategory },
    { id: 'eq3', text: 'I handle stress and pressure situations well', category: 'emotional-intelligence' as AssessmentCategory },
  ],
  'skills-readiness': [
    { id: 'sk1', text: 'I have experience with digital tools and software', category: 'skills-readiness' as AssessmentCategory },
    { id: 'sk2', text: 'I am comfortable learning new technologies', category: 'skills-readiness' as AssessmentCategory },
    { id: 'sk3', text: 'I have good communication and presentation skills', category: 'skills-readiness' as AssessmentCategory },
  ],
};

// Mock career recommendations
const mockRecommendations: CareerRecommendation[] = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Design and develop software applications using various programming languages and frameworks.',
    matchPercentage: 85,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Problem Solving'],
    salaryRange: '$70,000 - $150,000',
    growthPotential: 'High',
    icon: '💻'
  },
  {
    id: '2',
    title: 'Data Analyst',
    description: 'Analyze complex datasets to help organizations make informed decisions.',
    matchPercentage: 78,
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Visualization'],
    salaryRange: '$60,000 - $120,000',
    growthPotential: 'High',
    icon: '📊'
  },
  {
    id: '3',
    title: 'UX Designer',
    description: 'Create intuitive and beautiful user experiences for digital products.',
    matchPercentage: 72,
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    salaryRange: '$65,000 - $130,000',
    growthPotential: 'Medium',
    icon: '🎨'
  }
];

// Mock skill gaps
const mockSkillGaps: SkillGap[] = [
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
  }
];

// Mock learning roadmap
const mockRoadmap: RoadmapStep[] = [
  {
    id: '1',
    title: 'Master JavaScript Fundamentals',
    description: 'Build a strong foundation in JavaScript programming',
    duration: '4 weeks',
    completed: false,
    resources: [
      {
        type: 'course',
        title: 'JavaScript: The Complete Guide',
        url: 'https://example.com/js-course',
        platform: 'Udemy'
      },
      {
        type: 'book',
        title: 'Eloquent JavaScript',
        url: 'https://eloquentjavascript.net/'
      }
    ]
  },
  {
    id: '2',
    title: 'Learn React Framework',
    description: 'Master modern React development with hooks and best practices',
    duration: '6 weeks',
    completed: false,
    resources: [
      {
        type: 'course',
        title: 'React - The Complete Guide',
        url: 'https://example.com/react-course',
        platform: 'Udemy'
      }
    ]
  }
];

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      currentAssessment: {
        answers: [],
        currentCategory: null,
        currentQuestionIndex: 0,
        isCompleted: false,
      },
      results: [],
      isLoading: false,

      startAssessment: () => {
        set({
          currentAssessment: {
            answers: [],
            currentCategory: 'aptitude',
            currentQuestionIndex: 0,
            isCompleted: false,
          }
        });
      },

      answerQuestion: (questionId, category, answer) => {
        const currentAssessment = get().currentAssessment;
        const existingAnswerIndex = currentAssessment.answers.findIndex(
          a => a.questionId === questionId
        );

        const newAnswer: AssessmentAnswer = {
          questionId,
          category,
          answer,
          timestamp: new Date()
        };

        if (existingAnswerIndex >= 0) {
          // Update existing answer
          const updatedAnswers = [...currentAssessment.answers];
          updatedAnswers[existingAnswerIndex] = newAnswer;
          set({
            currentAssessment: {
              ...currentAssessment,
              answers: updatedAnswers
            }
          });
        } else {
          // Add new answer
          set({
            currentAssessment: {
              ...currentAssessment,
              answers: [...currentAssessment.answers, newAnswer]
            }
          });
        }
      },

      nextQuestion: () => {
        const currentAssessment = get().currentAssessment;
        const totalQuestions = Object.values(mockQuestions).flat().length;

        if (currentAssessment.currentQuestionIndex < totalQuestions - 1) {
          set({
            currentAssessment: {
              ...currentAssessment,
              currentQuestionIndex: currentAssessment.currentQuestionIndex + 1
            }
          });
        }
      },

      previousQuestion: () => {
        const currentAssessment = get().currentAssessment;
        if (currentAssessment.currentQuestionIndex > 0) {
          set({
            currentAssessment: {
              ...currentAssessment,
              currentQuestionIndex: currentAssessment.currentQuestionIndex - 1
            }
          });
        }
      },

      completeAssessment: async () => {
        const currentAssessment = get().currentAssessment;
        set({ isLoading: true });

        const categories = ['aptitude', 'interests', 'personality', 'emotional-intelligence', 'skills-readiness'] as AssessmentCategory[];
        const categoryScores: Record<AssessmentCategory, { score: number; maxScore: number; percentage: number }> = {} as Record<AssessmentCategory, { score: number; maxScore: number; percentage: number }>;

        let totalScore = 0;
        let totalMaxScore = 0;

        categories.forEach(category => {
          const categoryAnswers = currentAssessment.answers.filter(a => a.category === category);
          const score = categoryAnswers.reduce((sum, answer) => sum + answer.answer, 0);
          const maxScore = mockQuestions[category].length * 5;
          const percentage = Math.round((score / maxScore) * 100);

          totalScore += score;
          totalMaxScore += maxScore;

          categoryScores[category] = {
            score,
            maxScore,
            percentage
          };
        });

        const overallPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

        let finalResult: AssessmentResult = {
          id: Date.now().toString(),
          userId: 'local-user',
          completedAt: new Date(),
          categories: categoryScores,
          recommendations: mockRecommendations,
          skillGaps: mockSkillGaps,
          roadmap: mockRoadmap
        };

        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('User not authenticated');
          }

          // Get or create a default assessment
          let assessmentId: string;
          const { data: existingAssessments } = await assessmentsService.getAll();
          const defaultAssessment = existingAssessments?.find((a: any) => a.category === 'general' || a.title === 'Career Assessment');
          
          if (defaultAssessment) {
            assessmentId = defaultAssessment.id;
          } else {
            // Create a default assessment if none exists
            const { data: newAssessment, error: createError } = await supabase
              .from('assessments')
              .insert({
                title: 'Career Assessment',
                description: 'Comprehensive career assessment',
                category: 'general',
                total_questions: currentAssessment.answers.length,
              })
              .select()
              .single();

            if (createError || !newAssessment) {
              console.warn('Could not create assessment, using fallback');
              assessmentId = 'default-assessment-id';
            } else {
              assessmentId = newAssessment.id;
            }
          }

          // Save results to database
          const { data: savedResult, error: saveError } = await assessmentsService.submitResults(
            user.id,
            assessmentId,
            {
              score: totalScore,
              total_points: totalMaxScore,
              percentage: overallPercentage,
              answers: currentAssessment.answers.map(a => ({
                questionId: a.questionId,
                category: a.category,
                answer: a.answer,
                timestamp: a.timestamp
              }))
            }
          );

          if (saveError) {
            console.error('Error saving assessment results:', saveError);
            // Continue with local storage even if DB save fails
          }

          finalResult = {
            id: savedResult?.id || Date.now().toString(),
            userId: user.id,
            completedAt: new Date(),
            categories: categoryScores,
            recommendations: mockRecommendations,
            skillGaps: mockSkillGaps,
            roadmap: mockRoadmap
          };

          // Generate AI roadmap if OpenAI is available
          try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && supabaseUrl) {
              await fetch(`${supabaseUrl}/functions/v1/ai`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${session.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  assessmentData: {
                    id: savedResult?.id,
                    score: overallPercentage,
                    category: 'general'
                  },
                  careerGoals: '',
                  currentSkills: Object.keys(categoryScores).join(', ')
                }),
              });
            }
          } catch (aiError) {
            console.warn('AI roadmap generation failed:', aiError);
            // Non-critical, continue without AI roadmap
          }

        } catch (error: any) {
          console.error('Error completing assessment:', error);
        } finally {
          set({
            currentAssessment: {
              ...currentAssessment,
              isCompleted: true
            },
            results: [...get().results, finalResult],
            isLoading: false
          });
        }
      },

      resetAssessment: () => {
        set({
          currentAssessment: {
            answers: [],
            currentCategory: null,
            currentQuestionIndex: 0,
            isCompleted: false,
          }
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      getCurrentResult: () => {
        const results = get().results;
        return results.length > 0 ? results[results.length - 1] : null;
      }
    }),
    {
      name: 'careerpath-assessment-store',
      partialize: (state) => ({
        currentAssessment: state.currentAssessment,
        results: state.results
      })
    }
  )
);

// Helper functions
export const getAllQuestions = () => Object.values(mockQuestions).flat();
export const getQuestionsByCategory = (category: AssessmentCategory) => mockQuestions[category];
export const getTotalQuestions = () => getAllQuestions().length;
