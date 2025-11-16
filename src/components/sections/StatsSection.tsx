"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Stat } from '@/lib/home-data';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection({ stats }: { stats: Stat[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const numberRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      numberRefs.current.forEach((numberEl, index) => {
        if (!numberEl) return;

        const targetValue = parseInt(stats[index].number.replace(/[^\d]/g, ''));
        const isPercentage = stats[index].number.includes('%');

        gsap.fromTo(
          numberEl,
          { textContent: 0 },
          {
            textContent: targetValue,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: function () {
              if (isPercentage) {
                numberEl.textContent = Math.floor(this.targets()[0].textContent) + '%';
              } else {
                numberEl.textContent = Math.floor(this.targets()[0].textContent).toLocaleString() + '+';
              }
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Trusted by Thousands of Students</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">Join a growing community of professionals who found their perfect career path with CareerPath</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                  <span
                    ref={(el) => {
                      if (el) numberRefs.current[index] = el;
                    }}
                    className="tabular-nums"
                  >
                    0
                  </span>
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">{stat.label}</h3>
                <p className="font-body text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
