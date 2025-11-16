import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content animations
      const tl = gsap.timeline();

      tl.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50,
          rotateX: -15
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "power2.out"
        }
      )
      .fromTo(subtitleRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        },
        "-=0.6"
      )
      .fromTo(buttonsRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        },
        "-=0.4"
      );

      // Scroll-triggered parallax for hero section
      gsap.to(heroRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="text-center px-6 md:px-16 max-w-4xl mx-auto">
        <h1
          ref={titleRef}
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight"
        >
          Find Your Perfect Career Path with Real-Time Guidance
        </h1>
        <p
          ref={subtitleRef}
          className="font-body text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto"
        >
          AI-powered mentoring, assessments, and job recommendations.
        </p>
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button className="group relative border-2 border-black text-black hover:bg-black hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10 transition-colors duration-300">Book a Mentor</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
