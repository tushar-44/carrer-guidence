export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  careerPath: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Google',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    rating: 5,
    text: 'CareerPath helped me discover my passion for coding. The assessment was spot-on, and the mentorship program connected me with amazing professionals who guided me every step of the way. Now I\'m living my dream at Google!',
    careerPath: 'From confused student to Google engineer'
  },
  {
    id: 't2',
    name: 'Rahul Verma',
    role: 'Product Manager',
    company: 'Microsoft',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    rating: 5,
    text: 'I was stuck in a career I didn\'t enjoy. CareerPath\'s comprehensive assessment revealed my strengths in product thinking. The learning roadmap and mentor support made my transition smooth. Best decision ever!',
    careerPath: 'Career switcher to PM at Microsoft'
  },
  {
    id: 't3',
    name: 'Ananya Reddy',
    role: 'UX Designer',
    company: 'Airbnb',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    rating: 5,
    text: 'The platform\'s AI-driven career suggestions opened my eyes to UX design - a field I never considered. The structured learning path and portfolio guidance helped me land my dream job at Airbnb within 8 months!',
    careerPath: 'Discovered UX design passion'
  },
  {
    id: 't4',
    name: 'Arjun Patel',
    role: 'Data Scientist',
    company: 'Amazon',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    rating: 5,
    text: 'CareerPath\'s skill gap analysis was eye-opening. It showed me exactly what I needed to learn. The recommended courses and projects were perfect. My mentor\'s industry insights were invaluable. Now I\'m a Data Scientist at Amazon!',
    careerPath: 'From beginner to Amazon DS'
  },
  {
    id: 't5',
    name: 'Sneha Gupta',
    role: 'Marketing Manager',
    company: 'Spotify',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    rating: 5,
    text: 'I always loved creativity but didn\'t know which career path to choose. CareerPath\'s assessment matched me with digital marketing. The mentors taught me real-world strategies, and now I\'m thriving at Spotify!',
    careerPath: 'Found perfect creative career'
  },
  {
    id: 't6',
    name: 'Vikram Singh',
    role: 'DevOps Engineer',
    company: 'Netflix',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    rating: 5,
    text: 'The platform helped me transition from traditional IT to DevOps. The learning roadmap was comprehensive, and the job portal connected me with opportunities I wouldn\'t have found otherwise. Grateful for this platform!',
    careerPath: 'IT to DevOps transition'
  },
  {
    id: 't7',
    name: 'Meera Krishnan',
    role: 'AI/ML Engineer',
    company: 'OpenAI',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    rating: 5,
    text: 'CareerPath\'s assessment identified my aptitude for AI/ML when I was still in college. The structured learning path and mentor guidance helped me build a strong foundation. Now I\'m working on cutting-edge AI at OpenAI!',
    careerPath: 'College to OpenAI journey'
  },
  {
    id: 't8',
    name: 'Karthik Menon',
    role: 'Cybersecurity Analyst',
    company: 'Cisco',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    rating: 5,
    text: 'I was passionate about security but didn\'t know where to start. CareerPath\'s roadmap broke down the journey into manageable steps. The mentors shared real-world scenarios that prepared me for my role at Cisco.',
    careerPath: 'Passion to profession in security'
  }
];

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(t => t.id === id);
};

export const getRandomTestimonials = (count: number = 3): Testimonial[] => {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};