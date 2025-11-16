import type { AssessmentCategory } from '@/constants/index';

export interface Question {
  id: string;
  category: AssessmentCategory;
  question: string;
  options: {
    text: string;
    value: number;
    trait?: string;
  }[];
  type: 'single' | 'multiple' | 'scale';
}

export const assessmentQuestions: Question[] = [
  // Aptitude Questions
  {
    id: 'apt1',
    category: 'aptitude',
    question: 'If a train travels 120 km in 2 hours, what is its average speed?',
    options: [
      { text: '50 km/h', value: 0 },
      { text: '60 km/h', value: 10 },
      { text: '70 km/h', value: 0 },
      { text: '80 km/h', value: 0 }
    ],
    type: 'single'
  },
  {
    id: 'apt2',
    category: 'aptitude',
    question: 'Complete the pattern: 2, 4, 8, 16, __',
    options: [
      { text: '24', value: 0 },
      { text: '28', value: 0 },
      { text: '32', value: 10 },
      { text: '36', value: 0 }
    ],
    type: 'single'
  },
  {
    id: 'apt3',
    category: 'aptitude',
    question: 'Which word does not belong: Apple, Banana, Carrot, Orange',
    options: [
      { text: 'Apple', value: 0 },
      { text: 'Banana', value: 0 },
      { text: 'Carrot', value: 10 },
      { text: 'Orange', value: 0 }
    ],
    type: 'single'
  },
  {
    id: 'apt4',
    category: 'aptitude',
    question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.',
    options: [
      { text: 'True', value: 10 },
      { text: 'False', value: 0 }
    ],
    type: 'single'
  },
  {
    id: 'apt5',
    category: 'aptitude',
    question: 'A cube has how many edges?',
    options: [
      { text: '6', value: 0 },
      { text: '8', value: 0 },
      { text: '12', value: 10 },
      { text: '16', value: 0 }
    ],
    type: 'single'
  },

  // Interest Questions
  {
    id: 'int1',
    category: 'interests',
    question: 'I enjoy working with computers and technology',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'technology' },
      { text: 'Disagree', value: 3, trait: 'technology' },
      { text: 'Neutral', value: 5, trait: 'technology' },
      { text: 'Agree', value: 7, trait: 'technology' },
      { text: 'Strongly Agree', value: 10, trait: 'technology' }
    ],
    type: 'scale'
  },
  {
    id: 'int2',
    category: 'interests',
    question: 'I prefer working with people rather than data',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'people' },
      { text: 'Disagree', value: 3, trait: 'people' },
      { text: 'Neutral', value: 5, trait: 'people' },
      { text: 'Agree', value: 7, trait: 'people' },
      { text: 'Strongly Agree', value: 10, trait: 'people' }
    ],
    type: 'scale'
  },
  {
    id: 'int3',
    category: 'interests',
    question: 'I enjoy creative and artistic activities',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'creative' },
      { text: 'Disagree', value: 3, trait: 'creative' },
      { text: 'Neutral', value: 5, trait: 'creative' },
      { text: 'Agree', value: 7, trait: 'creative' },
      { text: 'Strongly Agree', value: 10, trait: 'creative' }
    ],
    type: 'scale'
  },
  {
    id: 'int4',
    category: 'interests',
    question: 'I like analyzing data and finding patterns',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'analytical' },
      { text: 'Disagree', value: 3, trait: 'analytical' },
      { text: 'Neutral', value: 5, trait: 'analytical' },
      { text: 'Agree', value: 7, trait: 'analytical' },
      { text: 'Strongly Agree', value: 10, trait: 'analytical' }
    ],
    type: 'scale'
  },
  {
    id: 'int5',
    category: 'interests',
    question: 'I enjoy leading and managing teams',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'leadership' },
      { text: 'Disagree', value: 3, trait: 'leadership' },
      { text: 'Neutral', value: 5, trait: 'leadership' },
      { text: 'Agree', value: 7, trait: 'leadership' },
      { text: 'Strongly Agree', value: 10, trait: 'leadership' }
    ],
    type: 'scale'
  },

  // Personality Questions
  {
    id: 'per1',
    category: 'personality',
    question: 'I am more of an introvert than an extrovert',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'introvert' },
      { text: 'Disagree', value: 3, trait: 'introvert' },
      { text: 'Neutral', value: 5, trait: 'introvert' },
      { text: 'Agree', value: 7, trait: 'introvert' },
      { text: 'Strongly Agree', value: 10, trait: 'introvert' }
    ],
    type: 'scale'
  },
  {
    id: 'per2',
    category: 'personality',
    question: 'I prefer structured and organized work environments',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'organized' },
      { text: 'Disagree', value: 3, trait: 'organized' },
      { text: 'Neutral', value: 5, trait: 'organized' },
      { text: 'Agree', value: 7, trait: 'organized' },
      { text: 'Strongly Agree', value: 10, trait: 'organized' }
    ],
    type: 'scale'
  },
  {
    id: 'per3',
    category: 'personality',
    question: 'I am comfortable taking risks and trying new things',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'risk-taker' },
      { text: 'Disagree', value: 3, trait: 'risk-taker' },
      { text: 'Neutral', value: 5, trait: 'risk-taker' },
      { text: 'Agree', value: 7, trait: 'risk-taker' },
      { text: 'Strongly Agree', value: 10, trait: 'risk-taker' }
    ],
    type: 'scale'
  },
  {
    id: 'per4',
    category: 'personality',
    question: 'I pay close attention to details',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'detail-oriented' },
      { text: 'Disagree', value: 3, trait: 'detail-oriented' },
      { text: 'Neutral', value: 5, trait: 'detail-oriented' },
      { text: 'Agree', value: 7, trait: 'detail-oriented' },
      { text: 'Strongly Agree', value: 10, trait: 'detail-oriented' }
    ],
    type: 'scale'
  },
  {
    id: 'per5',
    category: 'personality',
    question: 'I am adaptable and flexible in changing situations',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'adaptable' },
      { text: 'Disagree', value: 3, trait: 'adaptable' },
      { text: 'Neutral', value: 5, trait: 'adaptable' },
      { text: 'Agree', value: 7, trait: 'adaptable' },
      { text: 'Strongly Agree', value: 10, trait: 'adaptable' }
    ],
    type: 'scale'
  },

  // Emotional Intelligence Questions
  {
    id: 'eq1',
    category: 'emotional-intelligence',
    question: 'I can easily recognize emotions in others',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'empathy' },
      { text: 'Disagree', value: 3, trait: 'empathy' },
      { text: 'Neutral', value: 5, trait: 'empathy' },
      { text: 'Agree', value: 7, trait: 'empathy' },
      { text: 'Strongly Agree', value: 10, trait: 'empathy' }
    ],
    type: 'scale'
  },
  {
    id: 'eq2',
    category: 'emotional-intelligence',
    question: 'I handle stress and pressure well',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'stress-management' },
      { text: 'Disagree', value: 3, trait: 'stress-management' },
      { text: 'Neutral', value: 5, trait: 'stress-management' },
      { text: 'Agree', value: 7, trait: 'stress-management' },
      { text: 'Strongly Agree', value: 10, trait: 'stress-management' }
    ],
    type: 'scale'
  },
  {
    id: 'eq3',
    category: 'emotional-intelligence',
    question: 'I am good at resolving conflicts',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'conflict-resolution' },
      { text: 'Disagree', value: 3, trait: 'conflict-resolution' },
      { text: 'Neutral', value: 5, trait: 'conflict-resolution' },
      { text: 'Agree', value: 7, trait: 'conflict-resolution' },
      { text: 'Strongly Agree', value: 10, trait: 'conflict-resolution' }
    ],
    type: 'scale'
  },
  {
    id: 'eq4',
    category: 'emotional-intelligence',
    question: 'I am self-aware of my strengths and weaknesses',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'self-awareness' },
      { text: 'Disagree', value: 3, trait: 'self-awareness' },
      { text: 'Neutral', value: 5, trait: 'self-awareness' },
      { text: 'Agree', value: 7, trait: 'self-awareness' },
      { text: 'Strongly Agree', value: 10, trait: 'self-awareness' }
    ],
    type: 'scale'
  },
  {
    id: 'eq5',
    category: 'emotional-intelligence',
    question: 'I can motivate myself to achieve goals',
    options: [
      { text: 'Strongly Disagree', value: 1, trait: 'self-motivation' },
      { text: 'Disagree', value: 3, trait: 'self-motivation' },
      { text: 'Neutral', value: 5, trait: 'self-motivation' },
      { text: 'Agree', value: 7, trait: 'self-motivation' },
      { text: 'Strongly Agree', value: 10, trait: 'self-motivation' }
    ],
    type: 'scale'
  },

  // Skills Readiness Questions
  {
    id: 'skill1',
    category: 'skills-readiness',
    question: 'Rate your proficiency in programming/coding',
    options: [
      { text: 'No Experience', value: 0, trait: 'programming' },
      { text: 'Beginner', value: 3, trait: 'programming' },
      { text: 'Intermediate', value: 6, trait: 'programming' },
      { text: 'Advanced', value: 9, trait: 'programming' },
      { text: 'Expert', value: 10, trait: 'programming' }
    ],
    type: 'scale'
  },
  {
    id: 'skill2',
    category: 'skills-readiness',
    question: 'Rate your communication and presentation skills',
    options: [
      { text: 'Poor', value: 2, trait: 'communication' },
      { text: 'Fair', value: 4, trait: 'communication' },
      { text: 'Good', value: 6, trait: 'communication' },
      { text: 'Very Good', value: 8, trait: 'communication' },
      { text: 'Excellent', value: 10, trait: 'communication' }
    ],
    type: 'scale'
  },
  {
    id: 'skill3',
    category: 'skills-readiness',
    question: 'Rate your problem-solving abilities',
    options: [
      { text: 'Poor', value: 2, trait: 'problem-solving' },
      { text: 'Fair', value: 4, trait: 'problem-solving' },
      { text: 'Good', value: 6, trait: 'problem-solving' },
      { text: 'Very Good', value: 8, trait: 'problem-solving' },
      { text: 'Excellent', value: 10, trait: 'problem-solving' }
    ],
    type: 'scale'
  },
  {
    id: 'skill4',
    category: 'skills-readiness',
    question: 'Rate your teamwork and collaboration skills',
    options: [
      { text: 'Poor', value: 2, trait: 'teamwork' },
      { text: 'Fair', value: 4, trait: 'teamwork' },
      { text: 'Good', value: 6, trait: 'teamwork' },
      { text: 'Very Good', value: 8, trait: 'teamwork' },
      { text: 'Excellent', value: 10, trait: 'teamwork' }
    ],
    type: 'scale'
  },
  {
    id: 'skill5',
    category: 'skills-readiness',
    question: 'Rate your time management and organizational skills',
    options: [
      { text: 'Poor', value: 2, trait: 'time-management' },
      { text: 'Fair', value: 4, trait: 'time-management' },
      { text: 'Good', value: 6, trait: 'time-management' },
      { text: 'Very Good', value: 8, trait: 'time-management' },
      { text: 'Excellent', value: 10, trait: 'time-management' }
    ],
    type: 'scale'
  }
];

// Helper function to get questions by category
export const getQuestionsByCategory = (category: AssessmentCategory): Question[] => {
  return assessmentQuestions.filter(q => q.category === category);
};

// Helper function to calculate category score
export const calculateCategoryScore = (
  answers: Record<string, number>,
  category: AssessmentCategory
): number => {
  const categoryQuestions = getQuestionsByCategory(category);
  const totalScore = categoryQuestions.reduce((sum, question) => {
    return sum + (answers[question.id] || 0);
  }, 0);
  const maxScore = categoryQuestions.length * 10;
  return Math.round((totalScore / maxScore) * 100);
};