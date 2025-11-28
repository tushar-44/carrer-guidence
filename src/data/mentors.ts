export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  experience: number;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  bio: string;
  image: string;
  languages: string[];
  education: string;
  company: string;
  verified: boolean;
  responseTime: string;
  specializations: string[];
  achievements: string[];
  mentor_type?: 'near-peer' | 'professional';
  vetting_status?: 'pending' | 'approved' | 'rejected';
  email?: string; // Contact email
  phone?: string; // Contact phone
}

const baseMentors: Mentor[] = [
  {
    id: "m1",
    name: "LANA RHODES",
    title: "Senior Software Architect",
    expertise: ["Software Development", "System Design", "Cloud Architecture"],
    experience: 12,
    hourlyRate: 75,
    rating: 4.9,
    totalSessions: 342,
    availability: [
      { day: "Monday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["11:00 AM", "3:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] }
    ],
    bio: "Passionate about helping developers level up their skills. Former Tech Lead at Google with expertise in distributed systems and cloud architecture. I've mentored 300+ developers in their career journey.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    languages: ["English", "Spanish"],
    education: "PhD in Computer Science, Stanford University",
    company: "Google",
    verified: true,
    responseTime: "Within 2 hours",
    specializations: ["React", "Node.js", "AWS", "Microservices"],
    achievements: ["Google Cloud Certified", "Published 15+ research papers", "Speaker at 20+ tech conferences"]
  },
  {
    id: "m2",
    name: "Michael Chen",
    title: "Product Management Lead",
    expertise: ["Product Management", "Product Strategy", "User Research"],
    experience: 10,
    hourlyRate: 85,
    rating: 4.8,
    totalSessions: 267,
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["11:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] }
    ],
    bio: "Product leader with a track record of launching successful products at Meta and Amazon. I help aspiring PMs understand the craft and navigate their career path effectively.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    languages: ["English", "Mandarin"],
    education: "MBA, Harvard Business School",
    company: "Meta",
    verified: true,
    responseTime: "Within 3 hours",
    specializations: ["Product Roadmapping", "Stakeholder Management", "Data Analytics", "A/B Testing"],
    achievements: ["Launched 5 products with 10M+ users", "Product School Instructor", "Forbes 30 Under 30"]
  },
  {
    id: "m3",
    name: "Emily Rodriguez",
    title: "Principal UX Designer",
    expertise: ["UX Design", "UI Design", "Design Systems"],
    experience: 9,
    hourlyRate: 70,
    rating: 4.9,
    totalSessions: 298,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "1:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "3:00 PM"] }
    ],
    bio: "Award-winning designer passionate about creating delightful user experiences. I've designed products used by millions at Airbnb and now lead design at a fast-growing startup.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    languages: ["English", "Portuguese"],
    education: "MFA in Interaction Design, Carnegie Mellon",
    company: "Airbnb",
    verified: true,
    responseTime: "Within 1 hour",
    specializations: ["Figma", "User Research", "Prototyping", "Design Thinking"],
    achievements: ["Awwwards Winner", "Design Systems Expert", "Mentor at ADPList"]
  },
  {
    id: "m4",
    name: "Dr. Rajesh Kumar",
    title: "Data Science Director",
    expertise: ["Data Science", "Machine Learning", "AI"],
    experience: 15,
    hourlyRate: 90,
    rating: 5.0,
    totalSessions: 189,
    availability: [
      { day: "Tuesday", slots: ["9:00 AM", "11:00 AM", "4:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Sunday", slots: ["10:00 AM", "2:00 PM"] }
    ],
    bio: "Leading AI research and applications at Netflix. PhD in Machine Learning from MIT. I help data scientists and ML engineers advance their careers and master cutting-edge techniques.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    languages: ["English", "Hindi", "Tamil"],
    education: "PhD in Machine Learning, MIT",
    company: "Netflix",
    verified: true,
    responseTime: "Within 4 hours",
    specializations: ["Deep Learning", "NLP", "Computer Vision", "MLOps"],
    achievements: ["Published 30+ papers", "Kaggle Grandmaster", "ACM Fellow"]
  },
  {
    id: "m5",
    name: "Amanda Foster",
    title: "DevOps Engineering Manager",
    expertise: ["DevOps", "Cloud Infrastructure", "Site Reliability"],
    experience: 11,
    hourlyRate: 80,
    rating: 4.7,
    totalSessions: 234,
    availability: [
      { day: "Monday", slots: ["2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "3:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] }
    ],
    bio: "Infrastructure expert with experience scaling systems at Amazon and Uber. I help engineers build reliable, scalable systems and advance their DevOps careers.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
    languages: ["English", "French"],
    education: "MS in Computer Engineering, UC Berkeley",
    company: "Amazon",
    verified: true,
    responseTime: "Within 2 hours",
    specializations: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    achievements: ["AWS Certified Solutions Architect", "Reduced infrastructure costs by 40%", "Built systems handling 1B+ requests/day"]
  },
  {
    id: "m6",
    name: "James Wilson",
    title: "Marketing Strategy Director",
    expertise: ["Digital Marketing", "Growth Marketing", "Brand Strategy"],
    experience: 8,
    hourlyRate: 65,
    rating: 4.8,
    totalSessions: 156,
    availability: [
      { day: "Tuesday", slots: ["11:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM", "11:00 AM"] }
    ],
    bio: "Growth marketing expert who has helped scale startups from 0 to millions of users. Former marketing lead at Spotify, now advising multiple high-growth companies.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    languages: ["English"],
    education: "MBA, Northwestern Kellogg",
    company: "Spotify",
    verified: true,
    responseTime: "Within 3 hours",
    specializations: ["SEO", "Content Marketing", "Performance Marketing", "Analytics"],
    achievements: ["Grew user base by 500%", "Marketing Week Award Winner", "TEDx Speaker"]
  },
  {
    id: "m7",
    name: "Priya Sharma",
    title: "Full Stack Engineering Lead",
    expertise: ["Full Stack Development", "Web Development", "Mobile Development"],
    experience: 7,
    hourlyRate: 60,
    rating: 4.9,
    totalSessions: 421,
    availability: [
      { day: "Monday", slots: ["11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "1:00 PM"] }
    ],
    bio: "Passionate full-stack developer with expertise in modern web and mobile technologies. I love teaching and have helped hundreds of developers transition into tech careers.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    languages: ["English", "Hindi", "Gujarati"],
    education: "BS in Computer Science, IIT Delhi",
    company: "Microsoft",
    verified: true,
    responseTime: "Within 1 hour",
    specializations: ["React", "TypeScript", "Python", "React Native"],
    achievements: ["Microsoft MVP", "Open source contributor", "Bootcamp instructor"]
  },
  {
    id: "m8",
    name: "David Kim",
    title: "Cybersecurity Architect",
    expertise: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    experience: 13,
    hourlyRate: 95,
    rating: 4.8,
    totalSessions: 178,
    availability: [
      { day: "Tuesday", slots: ["9:00 AM", "2:00 PM"] },
      { day: "Thursday", slots: ["11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM"] }
    ],
    bio: "Cybersecurity expert protecting critical infrastructure at major tech companies. I help security professionals and developers build secure systems and advance their careers.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    languages: ["English", "Korean"],
    education: "MS in Cybersecurity, Georgia Tech",
    company: "Cisco",
    verified: true,
    responseTime: "Within 4 hours",
    specializations: ["Penetration Testing", "Security Architecture", "Compliance", "Incident Response"],
    achievements: ["CISSP Certified", "Found 50+ critical vulnerabilities", "Black Hat speaker"]
  },
  {
    id: "m9",
    name: "Lisa Thompson",
    title: "Career Coach & HR Leader",
    expertise: ["Career Coaching", "Resume Building", "Interview Prep"],
    experience: 14,
    hourlyRate: 55,
    rating: 5.0,
    totalSessions: 512,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "12:00 PM", "2:00 PM"] }
    ],
    bio: "Former VP of HR at Fortune 500 companies. I've helped thousands of professionals land their dream jobs through personalized coaching and strategic career planning.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    languages: ["English"],
    education: "MA in Organizational Psychology, Columbia",
    company: "LinkedIn",
    verified: true,
    responseTime: "Within 1 hour",
    specializations: ["Career Transitions", "Salary Negotiation", "Personal Branding", "Leadership Development"],
    achievements: ["Certified Career Coach", "Published author", "Featured in Forbes"]
  },
  {
    id: "m10",
    name: "Carlos Martinez",
    title: "Blockchain Solutions Architect",
    expertise: ["Blockchain", "Web3", "Smart Contracts"],
    experience: 6,
    hourlyRate: 100,
    rating: 4.7,
    totalSessions: 143,
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Sunday", slots: ["11:00 AM", "2:00 PM"] }
    ],
    bio: "Blockchain pioneer building decentralized applications and helping developers enter the Web3 space. Early contributor to Ethereum and advisor to multiple blockchain startups.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    languages: ["English", "Spanish"],
    education: "BS in Computer Science, MIT",
    company: "Coinbase",
    verified: true,
    responseTime: "Within 5 hours",
    specializations: ["Solidity", "Ethereum", "DeFi", "NFTs"],
    achievements: ["Built 10+ DApps", "Blockchain educator", "Web3 conference organizer"]
  },
  {
    id: "m11",
    name: "Dr. Aisha Patel",
    title: "Research Scientist",
    expertise: ["Research", "Academia", "Scientific Writing"],
    experience: 16,
    hourlyRate: 70,
    rating: 4.9,
    totalSessions: 201,
    availability: [
      { day: "Monday", slots: ["2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["11:00 AM", "3:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "2:00 PM"] }
    ],
    bio: "Leading researcher in computational biology with extensive experience in academic and industry research. I mentor PhD students and researchers on career development and research excellence.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    languages: ["English", "Hindi", "Gujarati"],
    education: "PhD in Computational Biology, Cambridge",
    company: "Stanford University",
    verified: true,
    responseTime: "Within 6 hours",
    specializations: ["Research Methodology", "Grant Writing", "Academic Publishing", "Lab Management"],
    achievements: ["100+ publications", "NIH Grant recipient", "Nature Editor"]
  },
  {
    id: "m12",
    name: "Tom Anderson",
    title: "Sales Leadership Coach",
    expertise: ["Sales", "Business Development", "Negotiation"],
    experience: 12,
    hourlyRate: 75,
    rating: 4.8,
    totalSessions: 287,
    availability: [
      { day: "Tuesday", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "3:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM", "11:00 AM", "1:00 PM"] }
    ],
    bio: "Top-performing sales leader with experience building and scaling sales teams at SaaS companies. I help sales professionals and entrepreneurs master the art of selling.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    languages: ["English"],
    education: "MBA, Wharton School",
    company: "Salesforce",
    verified: true,
    responseTime: "Within 2 hours",
    specializations: ["Enterprise Sales", "Team Building", "Sales Strategy", "CRM"],
    achievements: ["$50M+ in sales", "Sales Leader of the Year", "Built teams of 100+"]
  },
  {
    id: "m13",
    name: "Nina Kowalski",
    title: "Content Strategy Director",
    expertise: ["Content Strategy", "Copywriting", "SEO"],
    experience: 9,
    hourlyRate: 60,
    rating: 4.9,
    totalSessions: 324,
    availability: [
      { day: "Monday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "2:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "4:00 PM"] }
    ],
    bio: "Content strategist who has helped brands tell compelling stories and drive engagement. Former content lead at HubSpot, now consulting for startups and enterprises.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    languages: ["English", "Polish"],
    education: "MA in Journalism, Columbia",
    company: "HubSpot",
    verified: true,
    responseTime: "Within 2 hours",
    specializations: ["Content Marketing", "Brand Voice", "Editorial Strategy", "Social Media"],
    achievements: ["Content Marketing Award", "Published 500+ articles", "Grew organic traffic by 300%"]
  },
  {
    id: "m14",
    name: "Hassan Ali",
    title: "Mobile Engineering Lead",
    expertise: ["Mobile Development", "iOS", "Android"],
    experience: 10,
    hourlyRate: 70,
    rating: 4.8,
    totalSessions: 256,
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "1:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] }
    ],
    bio: "Mobile development expert with apps used by millions. I help developers build high-quality mobile applications and navigate the mobile development landscape.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    languages: ["English", "Arabic", "Urdu"],
    education: "BS in Software Engineering, NUST",
    company: "Uber",
    verified: true,
    responseTime: "Within 3 hours",
    specializations: ["Swift", "Kotlin", "React Native", "Flutter"],
    achievements: ["Google Developer Expert", "Apps with 10M+ downloads", "Mobile conference speaker"]
  },
  {
    id: "m15",
    name: "Sophie Laurent",
    title: "Finance & Investment Advisor",
    expertise: ["Finance", "Investment Banking", "Financial Planning"],
    experience: 11,
    hourlyRate: 85,
    rating: 4.7,
    totalSessions: 198,
    availability: [
      { day: "Monday", slots: ["9:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["11:00 AM", "1:00 PM"] }
    ],
    bio: "Finance professional with experience at Goldman Sachs and JP Morgan. I help finance professionals and entrepreneurs understand markets, investments, and financial strategy.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    languages: ["English", "French"],
    education: "MBA in Finance, INSEAD",
    company: "Goldman Sachs",
    verified: true,
    responseTime: "Within 4 hours",
    specializations: ["Portfolio Management", "Financial Modeling", "M&A", "Valuation"],
    achievements: ["CFA Charterholder", "Managed $500M+ portfolio", "Financial Times contributor"]
  }
];

// Helper functions
export const getMentorById = (id: string): Mentor | undefined => {
  return mentors.find(mentor => mentor.id === id);
};

export const filterMentors = (filters: {
  expertise?: string;
  minRating?: number;
  maxRate?: number;
  availability?: string;
}): Mentor[] => {
  return mentors.filter(mentor => {
    if (filters.expertise && !mentor.expertise.includes(filters.expertise)) {
      return false;
    }
    if (filters.minRating && mentor.rating < filters.minRating) {
      return false;
    }
    if (filters.maxRate && mentor.hourlyRate > filters.maxRate) {
      return false;
    }
    if (filters.availability) {
      const hasAvailability = mentor.availability.some(
        slot => slot.day === filters.availability
      );
      if (!hasAvailability) return false;
    }
    return true;
  });
};

// TEST MENTOR - Your Personal Profile for Testing
const testMentor: Mentor = {
    id: "test-mentor-1",
    name: "Test Mentor", // Replace with your name
    title: "Career Development Specialist",
    expertise: ["Career Guidance", "Interview Preparation", "Resume Building", "Skill Development"],
    experience: 3,
    hourlyRate: 50, // Free for testing - set to 0 for completely free
    rating: 5.0,
    totalSessions: 25,
    availability: [
      { day: "Monday", slots: ["10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"] },
      { day: "Tuesday", slots: ["11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "2:00 PM", "6:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Saturday", slots: ["11:00 AM", "2:00 PM"] }
    ],
    bio: "Passionate about helping students and professionals navigate their career paths. I specialize in providing personalized guidance for career transitions, interview preparation, and skill development. Available for testing the booking system!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", // Replace with your photo URL
    languages: ["English", "Hindi"],
    education: "Master's in Career Counseling", // Update with your education
    company: "CareerPath Platform",
    verified: true,
    responseTime: "Within 1 hour",
    specializations: ["Career Planning", "Mock Interviews", "LinkedIn Optimization", "Networking Strategies"],
    achievements: [
      "Helped 100+ students find their dream careers",
      "Certified Career Coach",
      "Expert in tech industry transitions"
    ],
    mentor_type: 'professional', // Change to 'near-peer' for free sessions
    vetting_status: 'approved',
    email: 'test.mentor@careerpath.dev', // Add your email
    phone: '+91 XXXXXXXXXX' // Add your phone number
};

// Combine base mentors with test mentor
export const mentors: Mentor[] = [...baseMentors, testMentor];

export const getTopMentors = (limit: number = 5): Mentor[] => {
  return [...mentors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};