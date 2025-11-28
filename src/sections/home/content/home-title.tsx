import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HomeTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let gradientAnimation: gsap.core.Tween | null = null;
    const ctx = gsap.context(() => {
      // Create a timeline for staggered text reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate each line with stagger and advanced effects
      tl.fromTo(line1Ref.current,
        {
          opacity: 0,
          y: 80,
          rotationX: -90,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        }
      )
      .fromTo(line2Ref.current,
        {
          opacity: 0,
          y: 80,
          rotationX: -90,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        },
        "-=0.8"
      )
      .fromTo(line3Ref.current,
        {
          opacity: 0,
          y: 80,
          rotationX: -90,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        },
        "-=0.8"
      );

      // Add floating animation
      gsap.to(containerRef.current, {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      // Add gradient animation effect
      gradientAnimation = gsap.to({}, {
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onUpdate: function() {
          const progress = this.progress();
          if (line1Ref.current && line2Ref.current && line3Ref.current) {
            const hue = 200 + progress * 60; // Animate between blue and purple
            [line1Ref.current, line2Ref.current, line3Ref.current].forEach((el) => {
              if (el) {
                el.style.filter = `drop-shadow(0 0 20px hsla(${hue}, 70%, 60%, 0.5))`;
              }
            });
          }
        }
      });
    }, containerRef);

    return () => {
      gradientAnimation?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="text-center relative w-full px-4">
      {/* Text backdrop for better visibility */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/30 rounded-[2.5rem] -z-10"></div>
      <h1 className="font-heading text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.08] tracking-tight relative z-10 px-6 py-8">
        <span
          ref={line1Ref}
          className="block bg-gradient-to-r from-[#fefefe] via-[#c9dcff] to-[#f8d7ff] bg-clip-text text-transparent mb-4 drop-shadow-[0_20px_45px_rgba(15,23,42,0.35)]"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.75)',
            transformStyle: 'preserve-3d',
            WebkitTextStroke: '0.03em rgba(255,255,255,0.35)'
          }}
        >
          FIND YOUR PERFECT
        </span>
        <span
          ref={line2Ref}
          className="block bg-gradient-to-r from-[#dff6ff] via-[#b9e0ff] to-[#f8d7ff] bg-clip-text text-transparent mb-4 drop-shadow-[0_18px_40px_rgba(15,23,42,0.35)]"
          style={{
            textShadow: '0 0 35px rgba(255, 255, 255, 0.65)',
            transformStyle: 'preserve-3d',
            WebkitTextStroke: '0.03em rgba(230,230,255,0.35)'
          }}
        >
          CAREER PATH
        </span>
        <span
          ref={line3Ref}
          className="block bg-gradient-to-r from-[#fff3e0] via-[#f0e7ff] to-[#d5f5ff] bg-clip-text text-transparent drop-shadow-[0_16px_32px_rgba(15,23,42,0.3)]"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.55)',
            transformStyle: 'preserve-3d',
            WebkitTextStroke: '0.03em rgba(255,255,255,0.3)'
          }}
        >
          WITH REAL-TIME GUIDANCE
        </span>
      </h1>
    </div>
  )
}
