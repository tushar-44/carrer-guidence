import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Users, Target, Award, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const differentiators = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Integrated Platform",
    description: "Unlike fragmented services, we combine assessment, mentorship, and job matching in one seamless experience.",
    highlight: "One-stop solution"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description: "Advanced algorithms provide personalized recommendations based on comprehensive data analysis.",
    highlight: "Data-driven guidance"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Real Industry Mentors",
    description: "Connect with actual professionals currently working in your target industries, not just career coaches.",
    highlight: "Industry expertise"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Proven Track Record",
    description: "95% of our users find fulfilling careers within 6 months, backed by real success stories.",
    highlight: "Results guaranteed"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Network",
    description: "Access opportunities and mentors across 50+ countries with localized insights and connections.",
    highlight: "Worldwide access"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Continuous Support",
    description: "Ongoing guidance through career transitions, skill development, and professional growth.",
    highlight: "Lifetime support"
  }
];

export function WhyCareerPath() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const differentiatorRefs = useRef<HTMLDivElement[]>([]);

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

      // Animate differentiators with stagger
      differentiatorRefs.current.forEach((diffEl, index) => {
        gsap.fromTo(diffEl,
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
              trigger: diffEl,
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
          <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl text-foreground mb-6">
            Why Choose CareerPath?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In a crowded market of career services, CareerPath stands out with our unique approach that
            delivers real results. Here's what makes us different and why thousands trust us with their
            career journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {differentiators.map((diff, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) differentiatorRefs.current[index] = el;
              }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {diff.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg text-foreground mb-2">
                    {diff.title}
                  </h3>
                  <p className="font-body text-muted-foreground mb-3 leading-relaxed">
                    {diff.description}
                  </p>
                  <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {diff.highlight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="font-heading text-2xl text-foreground text-center mb-8">
            CareerPath vs Traditional Career Services
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-heading text-foreground">Feature</th>
                  <th className="text-center py-3 font-heading text-foreground">Traditional Services</th>
                  <th className="text-center py-3 font-heading text-primary">CareerPath</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm">
                <tr className="border-b border-border/50">
                  <td className="py-4 text-foreground">Assessment Method</td>
                  <td className="py-4 text-center text-muted-foreground">Generic questionnaires</td>
                  <td className="py-4 text-center text-primary font-medium">AI-powered analysis</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 text-foreground">Mentorship Access</td>
                  <td className="py-4 text-center text-muted-foreground">Limited availability</td>
                  <td className="py-4 text-center text-primary font-medium">500+ industry experts</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 text-foreground">Job Matching</td>
                  <td className="py-4 text-center text-muted-foreground">Basic keyword search</td>
                  <td className="py-4 text-center text-primary font-medium">Assessment-based matching</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 text-foreground">Success Rate</td>
                  <td className="py-4 text-center text-muted-foreground">Variable results</td>
                  <td className="py-4 text-center text-primary font-medium">95% within 6 months</td>
                </tr>
                <tr>
                  <td className="py-4 text-foreground">Ongoing Support</td>
                  <td className="py-4 text-center text-muted-foreground">One-time consultation</td>
                  <td className="py-4 text-center text-primary font-medium">Continuous guidance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
