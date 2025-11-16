import { useEffect, useRef, useState } from 'react';

interface UseVideoViewportOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseVideoViewportReturn {
  isInViewport: boolean;
}

export function useVideoViewport(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseVideoViewportOptions = {}
): UseVideoViewportReturn {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    enabled = true
  } = options;

  const [isInViewport, setIsInViewport] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle viewport detection
  useEffect(() => {
    if (!enabled || !videoRef.current) {
      console.log('🎥 useVideoViewport: Not enabled or video ref not available');
      return;
    }

    const video = videoRef.current;
    console.log('🎥 useVideoViewport: Setting up Intersection Observer');

    // Create Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inViewport = entry.isIntersecting;
          console.log('🎥 useVideoViewport: Viewport change detected:', {
            isIntersecting: inViewport,
            intersectionRatio: entry.intersectionRatio,
            threshold
          });
          setIsInViewport(inViewport);
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Start observing
    observerRef.current.observe(video);
    console.log('🎥 useVideoViewport: Started observing video element');

    // Cleanup function
    return () => {
      if (observerRef.current) {
        console.log('🎥 useVideoViewport: Cleaning up Intersection Observer');
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled, threshold, rootMargin, videoRef]);

  return {
    isInViewport
  };
}