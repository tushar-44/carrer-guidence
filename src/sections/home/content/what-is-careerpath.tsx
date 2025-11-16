import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Users, Target, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Assessment",
    description: "Advanced algorithms analyze your skills, interests, and personality to identify your ideal career paths."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Mentorship",
    description: "Connect with industry professionals who provide personalized guidance and real-world insights."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Personalized Roadmap",
    description: "Get a customized learning and career development plan tailored to your unique profile."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Job Matching",
    description: "Access exclusive job opportunities that align with your assessment results and career goals."
  }
];

export function WhatIsCareerPath() {
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
            y: 40,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
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
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            What is CareerPath?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            CareerPath is an integrated career guidance platform that combines AI-powered assessments,
            expert mentorship, and personalized job matching to help students and professionals discover
            their ideal career paths and achieve their professional goals with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) featureRefs.current[index] = el;
              }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
          <div className="text-center">
            <h3 className="font-heading text-2xl text-foreground mb-4">
              Our Mission
            </h3>
            <p className="font-body text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To democratize career guidance by providing every individual with the tools, insights, and connections
              they need to make informed career decisions. We believe that when people find careers that align with
              their strengths and passions, they not only achieve personal fulfillment but also contribute more
              meaningfully to society.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
