// Mock data for career assessment AI

export const mockQuiz = [
  {
    question: "What type of work environment do you prefer?",
    options: ["Fast-paced startup", "Stable corporate", "Remote freelance", "Team collaboration"],
    correct: "Fast-paced startup",
    explanation: "This indicates your preference for dynamic environments.",
    skill: "Adaptability"
  },
  {
    question: "Which of these activities energizes you most?",
    options: ["Solving technical problems", "Designing user interfaces", "Analyzing data", "Leading teams"],
    correct: "Solving technical problems",
    explanation: "This shows your technical aptitude.",
    skill: "Problem Solving"
  },
  {
    question: "How do you handle complex challenges?",
    options: ["Break them into smaller parts", "Seek help from others", "Research extensively", "Trust intuition"],
    correct: "Break them into smaller parts",
    explanation: "This demonstrates analytical thinking.",
    skill: "Analytical Thinking"
  },
  {
    question: "What motivates you in a project?",
    options: ["Creating something new", "Achieving measurable results", "Helping others succeed", "Learning new skills"],
    correct: "Creating something new",
    explanation: "This indicates creative motivation.",
    skill: "Creativity"
  },
  {
    question: "How do you prefer to communicate ideas?",
    options: ["Through code and prototypes", "Visual presentations", "Written reports", "Verbal discussions"],
    correct: "Through code and prototypes",
    explanation: "This shows technical communication style.",
    skill: "Technical Communication"
  },
  {
    question: "What is your approach to learning?",
    options: ["Hands-on practice", "Structured courses", "Self-directed research", "Group learning"],
    correct: "Hands-on practice",
    explanation: "This indicates practical learning preference.",
    skill: "Practical Learning"
  },
  {
    question: "How do you handle deadlines?",
    options: ["Plan ahead meticulously", "Work under pressure", "Delegate tasks", "Focus on quality over speed"],
    correct: "Plan ahead meticulously",
    explanation: "This shows organizational skills.",
    skill: "Organization"
  },
  {
    question: "What type of feedback do you value most?",
    options: ["Code reviews", "Design critiques", "Performance metrics", "Personal development"],
    correct: "Code reviews",
    explanation: "This indicates technical feedback preference.",
    skill: "Technical Feedback"
  },
  {
    question: "How do you stay updated with industry trends?",
    options: ["Reading technical blogs", "Attending conferences", "Following influencers", "Building personal projects"],
    correct: "Reading technical blogs",
    explanation: "This shows continuous learning habits.",
    skill: "Continuous Learning"
  },
  {
    question: "What is your ideal team size?",
    options: ["Small (2-5 people)", "Medium (6-15 people)", "Large (16+ people)", "Solo work"],
    correct: "Small (2-5 people)",
    explanation: "This indicates collaboration preference.",
    skill: "Collaboration"
  }
];

export const mockEvaluation = {
  skillScores: {
    "Analytical": 85,
    "Creative": 70,
    "Technical": 90,
    "Leadership": 65,
    "Communication": 75
  },
  topCareers: ["Software Engineer", "Data Scientist", "Product Manager"]
};

export const mockRoadmap = {
  skillGaps: ["Data Structures", "System Design", "Cloud Computing"],
  learningPath: [
    "Complete online courses on Data Structures and Algorithms",
    "Build personal projects to practice System Design",
    "Get certified in AWS or Azure for Cloud Computing"
  ]
};

export const mockLearningResources = [
  { title: "freeCodeCamp Data Structures Course", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  { title: "Coursera System Design Course", url: "https://www.coursera.org/learn/system-design" },
  { title: "AWS Cloud Practitioner Certification", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" }
];
