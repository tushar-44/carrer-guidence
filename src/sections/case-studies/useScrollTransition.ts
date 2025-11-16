import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export type ActiveCaseStudy = 'design' | 'advertising';

export function useScrollTransition() {
  // Refs for GSAP targeting
  const sectionRef = useRef<HTMLDivElement>(null);  // <- Changed from containerRef
  const designVideoRef = useRef<HTMLDivElement>(null);
  const advertisingVideoRef = useRef<HTMLDivElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  // State to track which case study is currently active
  const [activeCaseStudy, setActiveCaseStudy] = useState<ActiveCaseStudy>('design');

  useLayoutEffect(() => {
    if (!sectionRef.current || !designVideoRef.current || !advertisingVideoRef.current) {
      return;
    }

    const section = sectionRef.current;  // <- Changed from container
    const designVideo = designVideoRef.current;
    const advertisingVideo = advertisingVideoRef.current;

    // Set initial positions
    gsap.set(designVideo, { y: 0, zIndex: 2 });
    gsap.set(advertisingVideo, { y: '100%', zIndex: 1 });

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,  // <- Now targets the entire section content
        start: 'center center',
        end: '+=100%', // Scroll distance for the animation
        pin: true,  // This will pin the entire section content
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // More precise content switching based on animation progress
          // Switch to advertising when we're more than halfway through
          if (self.progress > 0.5) {
            setActiveCaseStudy(current => {
              if (current === 'design') {
                console.log('Switching to advertising at progress:', self.progress);
                return 'advertising';
              }
              return current;
            });
          } else {
            // Switch back to design when we're in the first half
            setActiveCaseStudy(current => {
              if (current === 'advertising') {
                console.log('Switching to design at progress:', self.progress);
                return 'design';
              }
              return current;
            });
          }
        },
        invalidateOnRefresh: true,
      }
    });

    // Add video transition animations to timeline
    tl
      // Design video slides up and out
      .to(designVideo, {
        y: '-100%',
        duration: 1,
        ease: 'power2.inOut'
      })
      // Advertising video slides up to replace it (happens simultaneously)
      .to(advertisingVideo, {
        y: '0%',
        duration: 1,
        ease: 'power2.inOut'
      }, 0); // Start at the same time as the previous animation

    // Cleanup function
    return () => {
      // Kill the ScrollTrigger and timeline
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) {
          trigger.kill();
        }
      });
      tl.kill();
    };
  }, []); // Empty dependency array since we want this to run once

  // Additional effect to handle window resize
  useLayoutEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    // Refs for the components to use
    sectionRef,  // <- Changed from containerRef
    designVideoRef,
    advertisingVideoRef,
    rightBarRef,
    bottomBarRef,
    
    // Current active case study
    activeCaseStudy,
  };
}