import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export function HomeTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      // Simple high-performance animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5
      });
    }
  }, []);

  return (
    <div className="text-center">
      <h1
        ref={titleRef}
        className="font-heading text-[clamp(2rem,8vw,6rem)] leading-[0.8] tracking-tight text-white"
      >
        FIND YOUR PERFECT<br />CAREER PATH
      </h1>
    </div>
  )
}
