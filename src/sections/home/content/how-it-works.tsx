import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const steps = [
  {
    number: "01",
    title: "Take the Assessment",
    description: "Complete our comprehensive career aptitude test that analyzes your skills, interests, and personality to identify your ideal career paths.",
    icon: "🎯"
  },
  {
    number: "02",
    title: "Get Personalized Results",
    description: "Receive detailed insights about your career matches, including salary ranges, growth potential, and required skills for each path.",
    icon: "📊"
  },
  {
    number: "03",
    title: "Connect with Mentors",
    description: "Book sessions with industry experts who can provide personalized guidance and help you create a roadmap for your career transition.",
    icon: "🤝"
  }
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple high-performance animation for title
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // Animate steps on scroll
      stepRefs.current.forEach((stepEl, index) => {
        gsap.fromTo(stepEl,
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
              trigger: stepEl,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.2
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
          <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            How CareerPath Works
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect career in three simple steps. Our data-driven approach combines assessments,
            mentorship, and personalized guidance to accelerate your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) stepRefs.current[index] = el;
              }}
              className="relative text-center group"
            >
              {/* Step number background */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {step.number}
              </div>

              {/* Card */}
              <div className="bg-card border border-border rounded-xl p-8 pt-12 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-6">{step.icon}</div>
                <h3 className="font-heading text-xl text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-8 lg:w-12 h-0.5 bg-gradient-to-r from-primary to-transparent transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-heading text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
            Start Your Assessment
          </button>
          <p className="font-body text-sm text-muted-foreground mt-4">
            Free to start • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
