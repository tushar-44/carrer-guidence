import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "CareerPath helped me discover my passion for data science. The assessment was incredibly accurate, and connecting with mentors changed my career trajectory completely.",
    author: "Sarah Chen",
    role: "Data Scientist at Google",
    avatar: "/14140043_5384286.jpg"
  },
  {
    quote: "The personalized guidance I received was invaluable. Within 3 months of completing the assessment, I landed my dream job in product management.",
    author: "Marcus Rodriguez",
    role: "Product Manager at Meta",
    avatar: "/42113142_8899769.jpg"
  },
  {
    quote: "CareerPath's mentor network is exceptional. The insights I gained from industry experts helped me avoid common pitfalls and accelerate my growth.",
    author: "Emily Johnson",
    role: "Senior Software Engineer at Amazon",
    avatar: "/group-study.jpg"
  }
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate testimonials on scroll
      testimonialRefs.current.forEach((testimonialEl, index) => {
        if (!testimonialEl) return;

        gsap.fromTo(testimonialEl,
          {
            opacity: 0,
            y: 60,
            rotateY: -15
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: testimonialEl,
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
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Success Stories from Our Community
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students who transformed their careers with CareerPath's guidance and mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) testimonialRefs.current[index] = el;
              }}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="mb-6">
                <div className="flex text-yellow-500 mb-4">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className="text-lg">{star}</span>
                  ))}
                </div>
                <blockquote className="font-body text-muted-foreground italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-heading text-foreground font-medium">
                    {testimonial.author}
                  </div>
                  <div className="font-body text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-16">
          <p className="font-body text-muted-foreground mb-8">
            Trusted by students from leading universities and professionals worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="font-heading text-lg font-semibold text-muted-foreground">Stanford</div>
            <div className="font-heading text-lg font-semibold text-muted-foreground">MIT</div>
            <div className="font-heading text-lg font-semibold text-muted-foreground">Harvard</div>
            <div className="font-heading text-lg font-semibold text-muted-foreground">Google</div>
            <div className="font-heading text-lg font-semibold text-muted-foreground">Microsoft</div>
          </div>
        </div>
      </div>
    </section>
  );
}
