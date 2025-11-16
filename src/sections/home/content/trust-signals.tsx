import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const trustSignals = [
  {
    icon: "🏆",
    title: "Award Winning",
    description: "Recognized by leading education platforms for innovation in career guidance"
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy measures"
  },
  {
    icon: "⚡",
    title: "Fast Results",
    description: "Get comprehensive career insights in under 30 minutes"
  },
  {
    icon: "🌍",
    title: "Global Network",
    description: "Connect with mentors and opportunities across 50+ countries worldwide"
  },
  {
    icon: "📈",
    title: "Proven Success",
    description: "95% of our users find fulfilling careers within 6 months"
  },
  {
    icon: "💬",
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team"
  }
];

export function TrustSignals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const signalRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate trust signals with stagger
      signalRefs.current.forEach((signalEl, index) => {
        if (!signalEl) return;

        gsap.fromTo(signalEl,
          {
            opacity: 0,
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: signalEl,
              start: "top 90%",
              end: "bottom 10%",
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
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Why Choose CareerPath?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who trust CareerPath to guide their career journey with confidence and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustSignals.map((signal, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) signalRefs.current[index] = el;
              }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="text-3xl mb-4">{signal.icon}</div>
              <h3 className="font-heading text-lg text-foreground mb-2">
                {signal.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {signal.description}
              </p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="font-heading text-2xl text-foreground mb-4">
              Ready to Start Your Career Journey?
            </h3>
            <p className="font-body text-muted-foreground mb-6 max-w-xl mx-auto">
              Take the first step towards your dream career. Our assessment is free and takes less than 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-heading hover:bg-primary/90 transition-colors shadow-lg">
                Start Free Assessment
              </button>
              <button className="border border-border bg-background text-foreground px-8 py-3 rounded-lg font-heading hover:bg-accent transition-colors">
                Browse Mentors
              </button>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4">
              No credit card required • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
