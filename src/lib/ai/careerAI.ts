export async function generateAssessment(interests?: string[]) {
  // Mock implementation - in real app, this would call an AI service
  return {
    categories: {
      aptitude: { score: 18, maxScore: 25, percentage: 72 },
      interests: { score: 22, maxScore: 25, percentage: 88 },
      personality: { score: 19, maxScore: 25, percentage: 76 },
      'emotional-intelligence': { score: 21, maxScore: 25, percentage: 84 },
      'skills-readiness': { score: 17, maxScore: 25, percentage: 68 }
    },
    recommendations: [
      {
        id: '1',
        title: 'Software Engineer',
        description: 'Design and develop software applications',
        matchPercentage: 85,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        salaryRange: '$70,000 - $150,000',
        growthPotential: 'High',
        icon: '💻'
      }
    ],
    skillGaps: [
      {
        skill: 'Advanced JavaScript',
        currentLevel: 3,
        requiredLevel: 5,
        gap: 2,
        priority: 'high'
      }
    ],
    roadmap: [
      {
        id: '1',
        title: 'Master JavaScript Fundamentals',
        description: 'Build strong foundation',
        duration: '4 weeks',
        completed: false,
        resources: []
      }
    ]
  };
}
