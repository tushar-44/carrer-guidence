import { useEffect, useState } from 'react';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Delay smooth scroll initialization to improve initial load
    const timer = setTimeout(async () => {
      try {
        // Dynamically import heavy dependencies
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger')
        ]);

        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 2,
        });

        // Integrate with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        setIsReady(true);

        // Cleanup function
        return () => {
          lenis.destroy();
          gsap.ticker.remove((time) => lenis.raf(time * 1000));
        };
      } catch (error) {
        console.error('Failed to initialize smooth scroll:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}