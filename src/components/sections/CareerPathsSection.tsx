"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CareerPath } from '@/lib/home-data';

gsap.registerPlugin(ScrollTrigger);

export default function CareerPathsSection({ careerPaths }: { careerPaths: CareerPath[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.career-path-item');
      items.forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }, delay: i * 0.08 });
      });
    }, ref);

    return () => ctx.revert();
  }, [careerPaths]);

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Popular Career Paths</h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">Explore some of the in-demand career tracks our students pursue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerPaths.map((path) => (
            <div key={path.id} className="career-path-item bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg text-foreground">{path.title}</h3>
                <span className="text-sm text-muted-foreground">{path.badge}</span>
              </div>
              <p className="font-body text-muted-foreground">{path.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
