"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Feature } from '@/lib/home-data';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection({ features }: { features: Feature[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: titleRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      }

      featureRefs.current.forEach((featureEl, index) => {
        gsap.fromTo(featureEl, { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: featureEl, start: 'top 85%', toggleActions: 'play none none reverse' }, delay: index * 0.1 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [features]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="font-heading text-3xl md:text-4xl text-foreground mb-4">Comprehensive Career Guidance Platform</h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">Everything you need to discover, develop, and advance your career in one integrated platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.id} ref={(el) => { if (el) featureRefs.current[index] = el; }} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className={`mb-4 ${feature.color}`}>
                {/* icon placeholder */}
                <div className="w-8 h-8 bg-muted rounded-md" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-3">{feature.title}</h3>
              <p className="font-body text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
