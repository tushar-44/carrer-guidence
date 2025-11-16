export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  domain: string;
  experience: string;
  postedDate: string;
  deadline: string;
  companyLogo: string;
  benefits: string[];
  remote: boolean;
  matchPercentage?: number;
}

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    type: "full-time",
    salary: "$140,000 - $200,000",
    description: "Join our team to build next-generation web applications that serve billions of users. Work with cutting-edge technologies and collaborate with world-class engineers.",
    requirements: [
      "5+ years of experience in frontend development",
      "Expert knowledge of React, TypeScript, and modern web technologies",
      "Strong understanding of web performance optimization",
      "Experience with state management libraries (Redux, Zustand)",
      "Bachelor's degree in Computer Science or equivalent"
    ],
    responsibilities: [
      "Design and implement scalable frontend architectures",
      "Collaborate with designers and backend engineers",
      "Optimize application performance and user experience",
      "Mentor junior developers and conduct code reviews",
      "Contribute to technical documentation and best practices"
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "GraphQL", "Testing"],
    domain: "Software Development",
    experience: "5-8 years",
    postedDate: "2 days ago",
    deadline: "2024-02-15",
    companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "401k Matching", "Remote Work", "Learning Budget", "Stock Options"],
    remote: true
  },
  {
    id: "j2",
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    type: "full-time",
    salary: "$150,000 - $220,000",
    description: "Lead product strategy for our social platform features. Define roadmaps, work with cross-functional teams, and drive product success.",
    requirements: [
      "4+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with A/B testing and data-driven decision making",
      "Excellent communication and stakeholder management",
      "Technical background preferred"
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Prioritize features and manage product roadmap",
      "Collaborate with engineering, design, and data teams",
      "Analyze metrics and user feedback",
      "Present to leadership and stakeholders"
    ],
    skills: ["Product Strategy", "Analytics", "User Research", "Agile", "SQL", "A/B Testing"],
    domain: "Product Management",
    experience: "4-7 years",
    postedDate: "1 week ago",
    deadline: "2024-02-20",
    companyLogo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "Equity", "Gym Membership", "Free Meals", "Parental Leave"],
    remote: false
  },
  {
    id: "j3",
    title: "Data Scientist",
    company: "Netflix",
    location: "Los Gatos, CA",
    type: "full-time",
    salary: "$130,000 - $190,000",
    description: "Apply machine learning to improve content recommendations and user experience. Work with massive datasets and cutting-edge ML techniques.",
    requirements: [
      "MS or PhD in Computer Science, Statistics, or related field",
      "3+ years of experience in data science or ML",
      "Strong programming skills in Python",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "Knowledge of statistical analysis and experimentation"
    ],
    responsibilities: [
      "Develop and deploy ML models for recommendations",
      "Analyze user behavior and content performance",
      "Design and run A/B experiments",
      "Collaborate with product and engineering teams",
      "Present findings to stakeholders"
    ],
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics", "Spark"],
    domain: "Data Science",
    experience: "3-6 years",
    postedDate: "3 days ago",
    deadline: "2024-02-18",
    companyLogo: "https://images.unsplash.com/photo-1574267432644-f610f5b7e4d1?w=200&h=200&fit=crop",
    benefits: ["Unlimited PTO", "Health Insurance", "Stock Options", "Learning Budget", "Remote Work"],
    remote: true
  },
  {
    id: "j4",
    title: "UX Designer",
    company: "Airbnb",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$110,000 - $160,000",
    description: "Design intuitive user experiences for our global platform. Conduct research, create prototypes, and collaborate with product teams.",
    requirements: [
      "3+ years of UX design experience",
      "Strong portfolio demonstrating design process",
      "Proficiency in Figma and design tools",
      "Experience with user research methodologies",
      "Understanding of accessibility standards"
    ],
    responsibilities: [
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and high-fidelity designs",
      "Collaborate with product managers and engineers",
      "Maintain and evolve design system",
      "Present design solutions to stakeholders"
    ],
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility", "Sketch"],
    domain: "Design",
    experience: "3-5 years",
    postedDate: "5 days ago",
    deadline: "2024-02-22",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    benefits: ["Travel Credits", "Health Insurance", "401k", "Remote Work", "Professional Development"],
    remote: true
  },
  {
    id: "j5",
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$120,000 - $180,000",
    description: "Build and maintain cloud infrastructure at scale. Implement CI/CD pipelines and ensure system reliability for millions of users.",
    requirements: [
      "4+ years of DevOps or SRE experience",
      "Strong knowledge of AWS services",
      "Experience with Kubernetes and Docker",
      "Proficiency in scripting (Python, Bash)",
      "Understanding of networking and security"
    ],
    responsibilities: [
      "Design and maintain cloud infrastructure",
      "Implement CI/CD pipelines",
      "Monitor system performance and reliability",
      "Automate deployment and scaling processes",
      "Respond to incidents and improve system resilience"
    ],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python", "CI/CD", "Monitoring"],
    domain: "DevOps",
    experience: "4-7 years",
    postedDate: "1 day ago",
    deadline: "2024-02-25",
    companyLogo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "Stock Options", "Relocation Assistance", "Learning Budget", "Gym Membership"],
    remote: false
  },
  {
    id: "j6",
    title: "Marketing Manager",
    company: "Spotify",
    location: "New York, NY",
    type: "full-time",
    salary: "$95,000 - $145,000",
    description: "Drive growth through digital marketing campaigns. Analyze metrics, optimize user acquisition, and build brand awareness.",
    requirements: [
      "3+ years of digital marketing experience",
      "Strong analytical skills and data-driven mindset",
      "Experience with marketing automation tools",
      "Knowledge of SEO, SEM, and social media marketing",
      "Excellent communication and project management skills"
    ],
    responsibilities: [
      "Develop and execute marketing campaigns",
      "Analyze campaign performance and ROI",
      "Manage marketing budget and resources",
      "Collaborate with creative and product teams",
      "Optimize user acquisition funnels"
    ],
    skills: ["Digital Marketing", "SEO", "Analytics", "Content Strategy", "Social Media", "Google Ads"],
    domain: "Marketing",
    experience: "3-5 years",
    postedDate: "4 days ago",
    deadline: "2024-02-28",
    companyLogo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
    benefits: ["Music Subscription", "Health Insurance", "Flexible Hours", "Remote Work", "Professional Development"],
    remote: true
  },
  {
    id: "j7",
    title: "Backend Engineer",
    company: "Stripe",
    location: "Remote",
    type: "full-time",
    salary: "$135,000 - $195,000",
    description: "Build scalable backend systems for payment processing. Work with distributed systems and handle millions of transactions.",
    requirements: [
      "4+ years of backend development experience",
      "Strong knowledge of system design and architecture",
      "Experience with microservices and distributed systems",
      "Proficiency in Java, Go, or Python",
      "Understanding of databases and caching"
    ],
    responsibilities: [
      "Design and implement backend APIs",
      "Optimize system performance and scalability",
      "Ensure security and compliance standards",
      "Collaborate with frontend and infrastructure teams",
      "Participate in on-call rotation"
    ],
    skills: ["Java", "Go", "Python", "PostgreSQL", "Redis", "Microservices", "API Design"],
    domain: "Software Development",
    experience: "4-7 years",
    postedDate: "6 days ago",
    deadline: "2024-03-01",
    companyLogo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop",
    benefits: ["Competitive Salary", "Equity", "Health Insurance", "Remote Work", "Learning Budget"],
    remote: true
  },
  {
    id: "j8",
    title: "Mobile Developer (iOS)",
    company: "Uber",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$125,000 - $185,000",
    description: "Build and enhance our iOS app used by millions of riders and drivers. Create smooth, performant mobile experiences.",
    requirements: [
      "3+ years of iOS development experience",
      "Expert knowledge of Swift and iOS SDK",
      "Experience with UIKit and SwiftUI",
      "Understanding of mobile app architecture patterns",
      "Published apps on the App Store"
    ],
    responsibilities: [
      "Develop new features for iOS app",
      "Optimize app performance and battery usage",
      "Collaborate with design and backend teams",
      "Write unit and integration tests",
      "Participate in code reviews and technical discussions"
    ],
    skills: ["Swift", "iOS", "SwiftUI", "UIKit", "Core Data", "REST APIs", "Git"],
    domain: "Mobile Development",
    experience: "3-6 years",
    postedDate: "2 days ago",
    deadline: "2024-02-16",
    companyLogo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop",
    benefits: ["Ride Credits", "Health Insurance", "Stock Options", "Gym Membership", "Meals"],
    remote: false
  },
  {
    id: "j9",
    title: "Cybersecurity Analyst",
    company: "Cisco",
    location: "San Jose, CA",
    type: "full-time",
    salary: "$100,000 - $150,000",
    description: "Protect our infrastructure and customer data. Monitor threats, respond to incidents, and implement security best practices.",
    requirements: [
      "2+ years of cybersecurity experience",
      "Knowledge of security frameworks and compliance",
      "Experience with security tools (SIEM, IDS/IPS)",
      "Understanding of network security and protocols",
      "Security certifications (CISSP, CEH) preferred"
    ],
    responsibilities: [
      "Monitor security alerts and incidents",
      "Conduct vulnerability assessments",
      "Implement security controls and policies",
      "Respond to security incidents",
      "Provide security training and awareness"
    ],
    skills: ["Security", "Network Security", "SIEM", "Penetration Testing", "Compliance", "Incident Response"],
    domain: "Cybersecurity",
    experience: "2-5 years",
    postedDate: "1 week ago",
    deadline: "2024-03-05",
    companyLogo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "401k", "Certifications", "Remote Work", "Professional Development"],
    remote: true
  },
  {
    id: "j10",
    title: "Content Writer",
    company: "HubSpot",
    location: "Boston, MA",
    type: "full-time",
    salary: "$65,000 - $95,000",
    description: "Create engaging content for our blog, resources, and marketing materials. Help educate and inspire our audience.",
    requirements: [
      "2+ years of content writing experience",
      "Strong writing and editing skills",
      "Knowledge of SEO best practices",
      "Experience with content management systems",
      "Portfolio of published work"
    ],
    responsibilities: [
      "Write blog posts, guides, and marketing content",
      "Research industry trends and topics",
      "Optimize content for SEO",
      "Collaborate with marketing and design teams",
      "Analyze content performance metrics"
    ],
    skills: ["Content Writing", "SEO", "Copywriting", "Research", "CMS", "Analytics"],
    domain: "Content & Marketing",
    experience: "2-4 years",
    postedDate: "3 days ago",
    deadline: "2024-02-20",
    companyLogo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "Unlimited PTO", "Remote Work", "Learning Budget", "Wellness Programs"],
    remote: true
  },
  {
    id: "j11",
    title: "AI/ML Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$160,000 - $250,000",
    description: "Work on cutting-edge AI research and applications. Build and train large language models and other AI systems.",
    requirements: [
      "MS or PhD in Computer Science, AI, or related field",
      "Strong background in machine learning and deep learning",
      "Experience with PyTorch or TensorFlow",
      "Published research papers preferred",
      "Strong programming skills in Python"
    ],
    responsibilities: [
      "Develop and train AI models",
      "Conduct research on new AI techniques",
      "Optimize model performance and efficiency",
      "Collaborate with research and engineering teams",
      "Publish research findings"
    ],
    skills: ["Python", "PyTorch", "TensorFlow", "Deep Learning", "NLP", "Research", "Mathematics"],
    domain: "Artificial Intelligence",
    experience: "3-7 years",
    postedDate: "5 days ago",
    deadline: "2024-03-10",
    companyLogo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop",
    benefits: ["Competitive Salary", "Equity", "Health Insurance", "Research Budget", "Conference Travel"],
    remote: false
  },
  {
    id: "j12",
    title: "Sales Development Representative",
    company: "Salesforce",
    location: "Remote",
    type: "full-time",
    salary: "$60,000 - $90,000 + Commission",
    description: "Generate qualified leads and build pipeline for our sales team. First step to a successful sales career.",
    requirements: [
      "1+ years of sales or customer-facing experience",
      "Excellent communication and interpersonal skills",
      "Self-motivated and goal-oriented",
      "Experience with CRM tools preferred",
      "Bachelor's degree preferred"
    ],
    responsibilities: [
      "Prospect and qualify leads",
      "Conduct outreach via phone, email, and social media",
      "Schedule meetings for account executives",
      "Maintain CRM records",
      "Meet and exceed monthly quotas"
    ],
    skills: ["Sales", "Communication", "CRM", "Lead Generation", "Prospecting", "Negotiation"],
    domain: "Sales",
    experience: "1-3 years",
    postedDate: "2 days ago",
    deadline: "2024-02-15",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    benefits: ["Base + Commission", "Health Insurance", "Career Growth", "Training Programs", "Remote Work"],
    remote: true
  },
  {
    id: "j13",
    title: "Graphic Designer",
    company: "Adobe",
    location: "San Jose, CA",
    type: "full-time",
    salary: "$75,000 - $115,000",
    description: "Create stunning visual designs for our products and marketing. Work with industry-leading creative tools.",
    requirements: [
      "3+ years of graphic design experience",
      "Expert knowledge of Adobe Creative Suite",
      "Strong portfolio demonstrating creativity",
      "Understanding of design principles and typography",
      "Experience with motion graphics preferred"
    ],
    responsibilities: [
      "Design marketing materials and product assets",
      "Create brand guidelines and visual systems",
      "Collaborate with marketing and product teams",
      "Present design concepts to stakeholders",
      "Stay updated with design trends"
    ],
    skills: ["Graphic Design", "Adobe Creative Suite", "Illustration", "Typography", "Branding", "Motion Graphics"],
    domain: "Design",
    experience: "3-5 years",
    postedDate: "1 week ago",
    deadline: "2024-02-28",
    companyLogo: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop",
    benefits: ["Creative Cloud", "Health Insurance", "Stock Purchase Plan", "Learning Budget", "Hybrid Work"],
    remote: false
  },
  {
    id: "j14",
    title: "Business Analyst",
    company: "McKinsey & Company",
    location: "New York, NY",
    type: "full-time",
    salary: "$90,000 - $130,000",
    description: "Analyze business problems and provide strategic recommendations to Fortune 500 clients.",
    requirements: [
      "Bachelor's degree in Business, Economics, or related field",
      "2+ years of consulting or business analysis experience",
      "Strong analytical and problem-solving skills",
      "Excellent presentation and communication skills",
      "Proficiency in Excel and PowerPoint"
    ],
    responsibilities: [
      "Conduct market research and competitive analysis",
      "Develop business strategies and recommendations",
      "Create presentations for client meetings",
      "Analyze financial data and business metrics",
      "Collaborate with cross-functional teams"
    ],
    skills: ["Business Analysis", "Strategy", "Excel", "PowerPoint", "Research", "Communication"],
    domain: "Consulting",
    experience: "2-4 years",
    postedDate: "4 days ago",
    deadline: "2024-03-01",
    companyLogo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop",
    benefits: ["Competitive Salary", "Bonus", "Health Insurance", "Travel Opportunities", "MBA Sponsorship"],
    remote: false
  },
  {
    id: "j15",
    title: "QA Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "full-time",
    salary: "$95,000 - $140,000",
    description: "Ensure quality of our software products through comprehensive testing. Build automated test frameworks.",
    requirements: [
      "3+ years of QA or test automation experience",
      "Strong knowledge of testing methodologies",
      "Experience with automation tools (Selenium, Cypress)",
      "Programming skills in Java, Python, or JavaScript",
      "Understanding of CI/CD pipelines"
    ],
    responsibilities: [
      "Design and execute test plans",
      "Develop automated test scripts",
      "Identify and report bugs",
      "Collaborate with development teams",
      "Improve testing processes and tools"
    ],
    skills: ["QA", "Test Automation", "Selenium", "Cypress", "Java", "Python", "CI/CD"],
    domain: "Quality Assurance",
    experience: "3-6 years",
    postedDate: "6 days ago",
    deadline: "2024-02-25",
    companyLogo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "Stock Options", "Retirement Plan", "Learning Budget", "Hybrid Work"],
    remote: false
  },
  {
    id: "j16",
    title: "Data Analyst Intern",
    company: "Tesla",
    location: "Palo Alto, CA",
    type: "internship",
    salary: "$25 - $35/hour",
    description: "Gain hands-on experience analyzing data to drive business decisions. Work with real-world datasets.",
    requirements: [
      "Currently pursuing degree in Data Science, Statistics, or related field",
      "Knowledge of SQL and Python",
      "Understanding of statistical analysis",
      "Strong analytical and problem-solving skills",
      "Available for 3-6 month internship"
    ],
    responsibilities: [
      "Analyze business data and create reports",
      "Build dashboards and visualizations",
      "Support data-driven decision making",
      "Collaborate with cross-functional teams",
      "Present findings to stakeholders"
    ],
    skills: ["SQL", "Python", "Excel", "Data Visualization", "Statistics", "Tableau"],
    domain: "Data Analysis",
    experience: "0-1 years",
    postedDate: "3 days ago",
    deadline: "2024-02-18",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    benefits: ["Hourly Pay", "Learning Opportunities", "Mentorship", "Networking", "Potential Full-time Offer"],
    remote: false
  },
  {
    id: "j17",
    title: "HR Manager",
    company: "LinkedIn",
    location: "Sunnyvale, CA",
    type: "full-time",
    salary: "$105,000 - $155,000",
    description: "Lead HR initiatives and support our growing team. Drive talent acquisition, development, and retention.",
    requirements: [
      "5+ years of HR experience",
      "Strong knowledge of HR best practices and employment law",
      "Experience with HRIS systems",
      "Excellent interpersonal and communication skills",
      "Bachelor's degree in HR or related field"
    ],
    responsibilities: [
      "Manage recruitment and onboarding processes",
      "Develop and implement HR policies",
      "Handle employee relations and performance management",
      "Coordinate training and development programs",
      "Ensure compliance with labor laws"
    ],
    skills: ["HR Management", "Recruitment", "Employee Relations", "HRIS", "Compliance", "Training"],
    domain: "Human Resources",
    experience: "5-8 years",
    postedDate: "1 week ago",
    deadline: "2024-03-05",
    companyLogo: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "401k", "Parental Leave", "Professional Development", "Hybrid Work"],
    remote: false
  },
  {
    id: "j18",
    title: "Blockchain Developer",
    company: "Coinbase",
    location: "Remote",
    type: "full-time",
    salary: "$130,000 - $200,000",
    description: "Build decentralized applications and smart contracts. Work on the future of finance and Web3.",
    requirements: [
      "3+ years of software development experience",
      "Strong knowledge of blockchain technology",
      "Experience with Solidity and smart contracts",
      "Understanding of cryptography and security",
      "Passion for Web3 and decentralization"
    ],
    responsibilities: [
      "Develop and deploy smart contracts",
      "Build decentralized applications (DApps)",
      "Ensure security and optimize gas efficiency",
      "Collaborate with product and design teams",
      "Stay updated with blockchain innovations"
    ],
    skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "JavaScript", "Security"],
    domain: "Blockchain",
    experience: "3-6 years",
    postedDate: "5 days ago",
    deadline: "2024-02-22",
    companyLogo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200&h=200&fit=crop",
    benefits: ["Competitive Salary", "Crypto Bonuses", "Health Insurance", "Remote Work", "Learning Budget"],
    remote: true
  },
  {
    id: "j19",
    title: "Customer Success Manager",
    company: "Zendesk",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$80,000 - $120,000",
    description: "Help customers succeed with our platform. Build relationships and drive product adoption.",
    requirements: [
      "2+ years of customer success or account management experience",
      "Excellent communication and relationship-building skills",
      "Technical aptitude and problem-solving abilities",
      "Experience with SaaS products",
      "Customer-centric mindset"
    ],
    responsibilities: [
      "Onboard new customers and ensure successful adoption",
      "Build strong customer relationships",
      "Identify upsell and expansion opportunities",
      "Resolve customer issues and concerns",
      "Gather customer feedback for product improvements"
    ],
    skills: ["Customer Success", "Communication", "SaaS", "Account Management", "Problem Solving"],
    domain: "Customer Success",
    experience: "2-4 years",
    postedDate: "2 days ago",
    deadline: "2024-02-16",
    companyLogo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&h=200&fit=crop",
    benefits: ["Health Insurance", "Stock Options", "Flexible Hours", "Remote Work", "Professional Development"],
    remote: true
  },
  {
    id: "j20",
    title: "Video Editor",
    company: "YouTube",
    location: "Los Angeles, CA",
    type: "contract",
    salary: "$50 - $75/hour",
    description: "Edit engaging video content for our platform. Work with creators and internal teams.",
    requirements: [
      "3+ years of video editing experience",
      "Expert knowledge of Adobe Premiere Pro and After Effects",
      "Strong storytelling and creative skills",
      "Portfolio of edited videos",
      "Understanding of YouTube best practices"
    ],
    responsibilities: [
      "Edit videos for various content types",
      "Add graphics, effects, and animations",
      "Collaborate with content creators",
      "Optimize videos for platform performance",
      "Meet tight deadlines and quality standards"
    ],
    skills: ["Video Editing", "Adobe Premiere Pro", "After Effects", "Motion Graphics", "Storytelling"],
    domain: "Content Production",
    experience: "3-5 years",
    postedDate: "4 days ago",
    deadline: "2024-02-20",
    companyLogo: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop",
    benefits: ["Hourly Rate", "Flexible Schedule", "Creative Freedom", "Networking", "Portfolio Building"],
    remote: false
  }
];

// Helper functions
export const getJobById = (id: string): Job | undefined => {
  return jobs.find(job => job.id === id);
};

export const filterJobs = (filters: {
  domain?: string;
  type?: string;
  remote?: boolean;
  experience?: string;
  searchQuery?: string;
}): Job[] => {
  return jobs.filter(job => {
    if (filters.domain && job.domain !== filters.domain) {
      return false;
    }
    if (filters.type && job.type !== filters.type) {
      return false;
    }
    if (filters.remote !== undefined && job.remote !== filters.remote) {
      return false;
    }
    if (filters.experience && job.experience !== filters.experience) {
      return false;
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    return true;
  });
};

export const getRecommendedJobs = (userSkills: string[], limit: number = 5): Job[] => {
  const jobsWithMatch = jobs.map(job => {
    const matchingSkills = job.skills.filter(skill =>
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    const matchPercentage = Math.round((matchingSkills.length / job.skills.length) * 100);
    return { ...job, matchPercentage };
  });

  return jobsWithMatch
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    .slice(0, limit);
};

export const getJobDomains = (): string[] => {
  return Array.from(new Set(jobs.map(job => job.domain)));
};