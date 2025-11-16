import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Users, Briefcase, BarChart3, MessageSquare, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Career Assessment",
    description: "Comprehensive evaluation of your aptitude, interests, personality, and skills to identify high-match career paths.",
    color: "text-accent-cyan"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Expert Mentorship",
    description: "Connect with industry professionals for personalized guidance, career advice, and real-world insights.",
    color: "text-accent-green"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Job Marketplace",
    description: "Access curated job listings tailored to your assessment results and career aspirations.",
    color: "text-accent-purple"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Progress Tracking",
    description: "Monitor your career development with detailed analytics and personalized learning roadmaps.",
    color: "text-accent-orange"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Community Support",
    description: "Join a supportive community of peers, mentors, and career professionals for ongoing guidance.",
    color: "text-accent-pink"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Certification",
    description: "Earn recognized certifications and build a portfolio that showcases your skills and achievements.",
    color: "text-accent-purple"
  }
];

export function FeaturesOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Animate features with stagger
      featureRefs.current.forEach((featureEl, index) => {
        gsap.fromTo(featureEl,
          {
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featureEl,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Comprehensive Career Guidance Platform
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to discover, develop, and advance your career in one integrated platform.
            From assessment to employment, we provide the tools and support for every step of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) featureRefs.current[index] = el;
              }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className={`mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              {index === 0 && (
                <img
                  src="/task image.avif"
                  alt="AI Assessment Interface"
                  className="w-full h-32 object-cover rounded-lg mt-4"
                />
              )}
              {index === 1 && (
                <img
                  src="/group-study.jpg"
                  alt="Mentorship Session"
                  className="w-full h-32 object-cover rounded-lg mt-4"
                />
              )}
              {index === 2 && (
                <img
                  src="/14140043_5384286.jpg"
                  alt="Job Opportunities"
                  className="w-full h-32 object-cover rounded-lg mt-4"
                />
              )}
            </div>
          ))}
        </div>

        {/* Integration note */}
        <div className="text-center mt-16">
          <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="font-heading text-2xl text-foreground mb-4">
              Integrated Approach to Career Development
            </h3>
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
              Unlike fragmented career services, CareerPath integrates assessment, mentorship, and job matching
              into a seamless experience. Your assessment results inform mentor recommendations, which in turn
              guide your job search, creating a cohesive path to career success.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">AI-Powered</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Personalized</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Integrated</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Data-Driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
