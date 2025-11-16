"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Testimonial } from '@/lib/home-data';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const testimonialRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      testimonialRefs.current.forEach((testimonialEl, index) => {
        if (!testimonialEl) return;

        gsap.fromTo(testimonialEl, { opacity: 0, y: 60, rotateY: -15 }, { opacity: 1, y: 0, rotateY: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: testimonialEl, start: 'top 85%', end: 'bottom 15%', toggleActions: 'play none none reverse' }, delay: index * 0.2 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonials]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Success Stories from Our Community</h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">Hear from students who transformed their careers with CareerPath's guidance and mentorship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} ref={(el) => { if (el) testimonialRefs.current[index] = el; }} className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="mb-6">
                <div className="flex text-yellow-500 mb-4">{"★★★★★".split("").map((star, i) => (<span key={i} className="text-lg">{star}</span>))}</div>
                <blockquote className="font-body text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</blockquote>
              </div>

              <div className="flex items-center gap-4">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-heading text-foreground font-medium">{testimonial.author}</div>
                  <div className="font-body text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
