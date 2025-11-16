import type { RoadmapStep } from '@/constants/index';

export interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  rating: number;
  enrollments: number;
  price: string;
  url: string;
  thumbnail: string;
}

export const courses: Course[] = [
  {
    id: 'course1',
    title: 'Complete Web Development Bootcamp',
    provider: 'Udemy',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects.',
    duration: '65 hours',
    level: 'beginner',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    rating: 4.7,
    enrollments: 450000,
    price: '$89.99',
    url: 'https://www.udemy.com',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop'
  },
  {
    id: 'course2',
    title: 'Machine Learning Specialization',
    provider: 'Coursera',
    description: 'Master machine learning fundamentals with Andrew Ng. Learn supervised and unsupervised learning.',
    duration: '3 months',
    level: 'intermediate',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Neural Networks'],
    rating: 4.9,
    enrollments: 2000000,
    price: '$49/month',
    url: 'https://www.coursera.org',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop'
  },
  {
    id: 'course3',
    title: 'UX Design Professional Certificate',
    provider: 'Google Career Certificates',
    description: 'Learn UX design from Google experts. Build a professional portfolio.',
    duration: '6 months',
    level: 'beginner',
    skills: ['UX Design', 'Figma', 'User Research', 'Prototyping'],
    rating: 4.8,
    enrollments: 500000,
    price: '$39/month',
    url: 'https://www.coursera.org',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop'
  },
  {
    id: 'course4',
    title: 'AWS Certified Solutions Architect',
    provider: 'A Cloud Guru',
    description: 'Prepare for AWS certification. Learn cloud architecture and best practices.',
    duration: '40 hours',
    level: 'intermediate',
    skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Security'],
    rating: 4.6,
    enrollments: 300000,
    price: '$35/month',
    url: 'https://acloudguru.com',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop'
  },
  {
    id: 'course5',
    title: 'Digital Marketing Masterclass',
    provider: 'Udemy',
    description: 'Learn SEO, social media marketing, email marketing, and more.',
    duration: '23 hours',
    level: 'beginner',
    skills: ['SEO', 'Social Media', 'Email Marketing', 'Analytics'],
    rating: 4.5,
    enrollments: 200000,
    price: '$79.99',
    url: 'https://www.udemy.com',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop'
  }
];

// Learning roadmaps for different careers
export const learningRoadmaps: Record<string, RoadmapStep[]> = {
  'software-engineer': [
    {
      id: 'step1',
      title: 'Programming Fundamentals',
      description: 'Learn programming basics with Python or JavaScript',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'Python for Beginners',
          platform: 'Codecademy',
          url: 'https://www.codecademy.com'
        },
        {
          type: 'book',
          title: 'Automate the Boring Stuff with Python'
        }
      ],
      completed: false
    },
    {
      id: 'step2',
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental CS concepts',
      duration: '3-4 months',
      resources: [
        {
          type: 'course',
          title: 'Algorithms Specialization',
          platform: 'Coursera'
        },
        {
          type: 'project',
          title: 'LeetCode Practice - 100 Problems'
        }
      ],
      completed: false
    },
    {
      id: 'step3',
      title: 'Web Development',
      description: 'Learn frontend and backend development',
      duration: '4-6 months',
      resources: [
        {
          type: 'course',
          title: 'Full Stack Web Development',
          platform: 'Udemy'
        },
        {
          type: 'project',
          title: 'Build 3 Full-Stack Projects'
        }
      ],
      completed: false
    },
    {
      id: 'step4',
      title: 'System Design',
      description: 'Learn to design scalable systems',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'System Design Interview',
          platform: 'Educative'
        },
        {
          type: 'book',
          title: 'Designing Data-Intensive Applications'
        }
      ],
      completed: false
    },
    {
      id: 'step5',
      title: 'Interview Preparation',
      description: 'Prepare for technical interviews',
      duration: '2-3 months',
      resources: [
        {
          type: 'mentorship',
          title: 'Mock Interviews with Senior Engineers'
        },
        {
          type: 'project',
          title: 'Portfolio Website with Projects'
        }
      ],
      completed: false
    }
  ],
  'data-scientist': [
    {
      id: 'step1',
      title: 'Python & Statistics',
      description: 'Learn Python programming and statistical analysis',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'Python for Data Science',
          platform: 'DataCamp'
        },
        {
          type: 'course',
          title: 'Statistics Fundamentals',
          platform: 'Khan Academy'
        }
      ],
      completed: false
    },
    {
      id: 'step2',
      title: 'Machine Learning Basics',
      description: 'Understand ML algorithms and applications',
      duration: '3-4 months',
      resources: [
        {
          type: 'course',
          title: 'Machine Learning by Andrew Ng',
          platform: 'Coursera'
        },
        {
          type: 'project',
          title: 'Kaggle Competitions - 3 Projects'
        }
      ],
      completed: false
    },
    {
      id: 'step3',
      title: 'Deep Learning',
      description: 'Master neural networks and deep learning',
      duration: '3-4 months',
      resources: [
        {
          type: 'course',
          title: 'Deep Learning Specialization',
          platform: 'Coursera'
        },
        {
          type: 'project',
          title: 'Build Image Classification Model'
        }
      ],
      completed: false
    },
    {
      id: 'step4',
      title: 'Data Engineering',
      description: 'Learn data pipelines and big data tools',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'Data Engineering with Python',
          platform: 'DataCamp'
        }
      ],
      completed: false
    }
  ],
  'product-manager': [
    {
      id: 'step1',
      title: 'Product Management Fundamentals',
      description: 'Learn PM basics and frameworks',
      duration: '1-2 months',
      resources: [
        {
          type: 'course',
          title: 'Product Management 101',
          platform: 'Product School'
        },
        {
          type: 'book',
          title: 'Inspired by Marty Cagan'
        }
      ],
      completed: false
    },
    {
      id: 'step2',
      title: 'User Research & Analytics',
      description: 'Master user research and data analysis',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'User Research Methods',
          platform: 'Coursera'
        },
        {
          type: 'course',
          title: 'Product Analytics',
          platform: 'Reforge'
        }
      ],
      completed: false
    },
    {
      id: 'step3',
      title: 'Technical Skills',
      description: 'Understand technology and work with engineers',
      duration: '2-3 months',
      resources: [
        {
          type: 'course',
          title: 'SQL for Product Managers',
          platform: 'Mode Analytics'
        },
        {
          type: 'course',
          title: 'APIs and Technical Concepts',
          platform: 'Codecademy'
        }
      ],
      completed: false
    }
  ]
};

// Helper functions
export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getRecommendedCourses = (skills: string[], limit: number = 5): Course[] => {
  const coursesWithMatch = courses.map(course => {
    const matchingSkills = course.skills.filter(skill =>
      skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    const matchScore = matchingSkills.length;
    return { ...course, matchScore };
  });

  return coursesWithMatch
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

export const getRoadmapForCareer = (careerId: string): RoadmapStep[] => {
  return learningRoadmaps[careerId] || [];
};